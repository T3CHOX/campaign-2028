/* Decision 2028: policy, electorate, advertising, and county interfaces.
 * Published polling is the only source of candidate support in this module.
 * Load after main.js and the IssueModel / Electorate / GroupPolling / AdEngine modules.
 */
(function () {
    'use strict';

    var ui = {
        dialogs: [], issueSearch: '', issueCategory: 'all', groupSearch: '',
        groupCategory: 'all', groupId: null, adConfig: null, lastAdMessage: ''
    };
    var partyColors = { D: '#00aef3', R: '#f14b52', I: '#b998e8', G: '#45bf80', L: '#ffab58', PSL: '#ed7878' };
    function esc(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function number(value, digits) { return Number.isFinite(Number(value)) ? Number(value).toLocaleString(undefined, { maximumFractionDigits: digits == null ? 1 : digits }) : '—'; }
    function color(party) { return partyColors[party] || '#c1c8d1'; }
    function el(id) { return document.getElementById(id); }
    function activeCandidates() {
        if (typeof Utils === 'undefined' || !Utils.getActiveCandidates) return [];
        return Utils.getActiveCandidates().map(function (entry) {
            var candidate = entry.cand || entry;
            return Object.assign({}, candidate, { party: candidate.party || entry.party });
        }).filter(function (candidate) { return candidate && candidate.id; });
    }
    function issueList() { return typeof CORE_ISSUES === 'undefined' ? [] : CORE_ISSUES; }
    function issueOptionLabel(issue) {
        var priority = typeof CampaignPriorities !== 'undefined' && gameData.candidate && CampaignPriorities.has(gameData.candidate, issue.id);
        return (priority ? '★ ' : '') + issue.name + (priority ? ' · PRIORITY' : '');
    }
    function groupMap() {
        if (typeof INTEREST_GROUPS === 'undefined') return {};
        return Object.keys(INTEREST_GROUPS).reduce(function (visible, id) {
            if (!INTEREST_GROUPS[id].internalOnly) visible[id] = INTEREST_GROUPS[id];
            return visible;
        }, {});
    }
    function positionsFor(issue) { return issue.positions || (typeof IssueModel !== 'undefined' ? IssueModel.positions : []) || []; }
    function positionClass(position) { return ' ov-position-' + String(position.id || '').replace(/[^a-z0-9_-]/gi, ''); }
    function candidatePosition(candidate, issue) {
        return typeof IssueModel !== 'undefined' && candidate ? IssueModel.getPosition(candidate.id || candidate, issue.id) : null;
    }
    function issueName(id) { var issue = issueList().find(function (item) { return item.id === id; }); return issue ? issue.name : id || 'General campaign'; }
    function safeURL(value, local) {
        var url = String(value || '').trim();
        if (/^https?:\/\//i.test(url)) return url;
        if (local && /^(?:\.\/)?(?:images|assets)\/[\w./% -]+$/i.test(url) && url.indexOf('..') === -1) return url;
        return '';
    }
    function portrait(candidate, large) {
        var fallback = /^[a-z0-9_-]+$/i.test(String(candidate.id || '')) ? 'images/' + candidate.id + '.jpg' : '';
        var preferred = candidate.image || candidate.img;
        if (preferred === 'images/scenario.jpg') preferred = fallback;
        var src = safeURL(preferred, true) || fallback;
        var initials = String(candidate.name || '?').split(/\s+/).map(function (part) { return part[0]; }).slice(0, 2).join('');
        return '<span class="ov-portrait' + (large ? ' ov-portrait-large' : '') + '" style="--candidate-color:' + color(candidate.party) + '">' +
            '<span aria-hidden="true">' + esc(initials) + '</span>' + (src ? '<img src="' + esc(src) + '" data-fallback-src="' + esc(src === fallback ? '' : fallback) + '" alt="' + esc(candidate.name) + '" loading="lazy">' : '') + '</span>';
    }
    function empty(message) { return '<p class="ov-empty">' + esc(message) + '</p>'; }
    function notice(message) { return '<p class="ov-note">' + esc(message) + '</p>'; }
    function toast(message) { if (typeof Utils !== 'undefined' && Utils.showToast) Utils.showToast(message); }
    function refreshHUD() { if (typeof Campaign !== 'undefined' && Campaign.updateHUD) Campaign.updateHUD(); }
    function button(action, label, attributes, className) {
        return '<button type="button" class="ov-button ' + (className || '') + '" data-ov-action="' + action + '" ' + (attributes || '') + '>' + label + '</button>';
    }

    function dialog(id, title, wide) {
        var node = el(id);
        if (!node) {
            node = document.createElement('div');
            node.id = id;
            node.className = 'ov-overlay hidden';
            node.innerHTML = '<section class="ov-dialog' + (wide ? ' ov-dialog-wide' : '') + '" role="dialog" aria-modal="true" aria-labelledby="' + id + '-title" tabindex="-1">' +
                '<header class="ov-dialog-header"><div><span class="ov-eyebrow">DECISION 2028 / CAMPAIGN DESK</span><h2 id="' + id + '-title"></h2></div>' +
                button('close', '<span aria-hidden="true">×</span>', 'data-dialog="' + id + '" aria-label="Close dialog"', 'ov-close') + '</header>' +
                '<div class="ov-dialog-body" id="' + id + '-body"></div></section>';
            document.body.appendChild(node);
            node.addEventListener('click', function (event) { if (event.target === node) closeDialog(id); });
        }
        el(id + '-title').textContent = title;
        return el(id + '-body');
    }
    function openDialog(id) {
        var node = el(id);
        if (!node) return;
        var existing = ui.dialogs.findIndex(function (entry) { return entry.id === id; });
        if (existing === -1) ui.dialogs.push({ id: id, opener: document.activeElement });
        node.style.zIndex = String(5000 + ui.dialogs.length * 10);
        node.classList.remove('hidden');
        window.requestAnimationFrame(function () {
            var focus = node.querySelector('[data-initial-focus], .ov-close');
            if (focus) focus.focus();
        });
    }
    function closeDialog(id) {
        var node = el(id);
        if (node) node.classList.add('hidden');
        var index = ui.dialogs.findIndex(function (entry) { return entry.id === id; });
        if (index !== -1) {
            var entry = ui.dialogs.splice(index, 1)[0];
            if (entry.opener && entry.opener.isConnected && entry.opener.offsetParent !== null) entry.opener.focus();
            else if (ui.dialogs.length) el(ui.dialogs[ui.dialogs.length - 1].id).querySelector('.ov-close').focus();
        }
    }
    function hideLegacy(id) { if (el(id)) el(id).classList.add('hidden'); }

    function renderIssues() {
        var body = dialog('ov-issues', 'Your policy platform', true);
        if (typeof IssueModel === 'undefined' || !issueList().length) {
            body.innerHTML = empty('The issue library is not available yet. Reopen this panel after the campaign finishes loading.');
            return;
        }
        var categories = Array.from(new Set(issueList().map(function (issue) { return issue.category; })));
        body.innerHTML = '<p class="ov-intro">Choose a position on each issue. Read the policy commitments before changing your platform; ideological labels do not tell the whole story. Candidates’ starting positions are scenario assumptions, not verified real-world commitments.</p>' +
            '<div class="ov-toolbar"><label class="ov-search">Find an issue<input type="search" id="ov-issue-search" value="' + esc(ui.issueSearch) + '" placeholder="Search H-1B, housing, Israel…" data-initial-focus></label>' +
            '<label>Policy area<select id="ov-issue-category"><option value="all">All policy areas</option>' + categories.map(function (category) {
                return '<option' + (category === ui.issueCategory ? ' selected' : '') + ' value="' + esc(category) + '">' + esc(category) + '</option>';
            }).join('') + '</select></label></div><p class="ov-result-count" id="ov-issue-count" aria-live="polite"></p>' +
            '<div id="ov-issue-list">' + categories.map(function (category) {
                return '<section class="ov-issue-section" data-category="' + esc(category) + '"><h3 class="ov-section-heading">' + esc(category) + '</h3>' +
                    issueList().filter(function (issue) { return issue.category === category; }).sort(function (a, b) {
                        var priorities = typeof CampaignPriorities !== 'undefined' && gameData.candidate ? CampaignPriorities.forCandidate(gameData.candidate) : [];
                        var aIndex = priorities.indexOf(a.id), bIndex = priorities.indexOf(b.id);
                        if (aIndex === -1 && bIndex === -1) return 0;
                        if (aIndex === -1) return 1;
                        if (bIndex === -1) return -1;
                        return aIndex - bIndex;
                    }).map(renderIssue).join('') + '</section>';
            }).join('') + '</div><p id="ov-issue-empty" class="ov-empty hidden">No issues match this search.</p>';
        filterIssues();
    }
    function renderIssue(issue) {
        var current = candidatePosition(gameData.candidate, issue);
        var priority = typeof CampaignPriorities !== 'undefined' && gameData.candidate && CampaignPriorities.has(gameData.candidate, issue.id);
        var stances = positionsFor(issue);
        var rivals = activeCandidates().filter(function (candidate) { return !gameData.candidate || candidate.id !== gameData.candidate.id; });
        return '<details class="ov-issue' + (priority ? ' ov-issue-priority' : '') + '" data-issue="' + esc(issue.id) + '" data-search="' + esc((issue.name + ' ' + issue.description + ' ' + issue.category).toLowerCase()) + '">' +
            '<summary><span>' + (priority ? '★ ' : '') + esc(issue.name) + '</span><span class="ov-position-chip">' + esc(current ? current.label : 'Position unavailable') + '</span></summary>' +
            '<div class="ov-issue-body"><p class="ov-prose">' + esc(issue.description) + '</p>' +
            (typeof CampaignPriorities !== 'undefined' && gameData.candidate ? button('toggle-priority', priority ? '★ Campaign priority' : '☆ Make campaign priority', 'data-issue="' + esc(issue.id) + '" aria-pressed="' + priority + '"', 'ov-priority-button' + (priority ? ' is-active' : '')) : '') +
            '<fieldset class="ov-stance-picker"><legend>Your position</legend><div class="ov-stance-options">' +
            stances.map(function (stance) {
                var currentClass = current && current.id === stance.id ? ' is-current' : '';
                return button('stance-preview', esc(stance.label), 'data-issue="' + esc(issue.id) + '" data-position="' + esc(stance.id) + '" aria-pressed="' + Boolean(current && current.id === stance.id) + '"', 'ov-stance' + positionClass(stance) + currentClass);
            }).join('') + '</div></fieldset><div class="ov-stance-description" data-stance-description="' + esc(issue.id) + '">' +
            '<h4>' + esc(current ? current.label : 'Select a position to read its commitments') + '</h4><p>' + esc(current ? current.description : '') + '</p></div>' +
            '<div data-stance-confirm="' + esc(issue.id) + '"></div>' +
            (rivals.length ? '<details class="ov-comparison"><summary>Compare candidate positions (' + rivals.length + ')</summary><div>' + rivals.map(function (candidate) {
                var position = candidatePosition(candidate, issue);
                return '<article class="ov-rival-stance"><div class="ov-person">' + portrait(candidate) + '<span><strong>' + esc(candidate.name) + '</strong><small>' + esc(position ? position.label : 'Unavailable') + '</small></span></div>' +
                    '<p>' + esc(position ? position.description : 'No policy position is available for this candidate.') + '</p></article>';
            }).join('') + '</div></details>' : '') + '</div></details>';
    }
    function filterIssues() {
        var list = el('ov-issue-list');
        if (!list) return;
        var count = 0;
        list.querySelectorAll('.ov-issue-section').forEach(function (section) {
            var sectionCount = 0;
            section.querySelectorAll('.ov-issue').forEach(function (issue) {
                var visible = (ui.issueCategory === 'all' || ui.issueCategory === section.dataset.category) && issue.dataset.search.indexOf(ui.issueSearch.toLowerCase().trim()) !== -1;
                issue.hidden = !visible;
                if (visible) sectionCount++;
            });
            section.hidden = sectionCount === 0;
            count += sectionCount;
        });
        el('ov-issue-count').textContent = count + ' of ' + issueList().length + ' issues';
        el('ov-issue-empty').classList.toggle('hidden', count !== 0);
    }
    function previewStance(issueId, positionId) {
        var issue = IssueModel.getIssue(issueId);
        if (!issue) return;
        var stance = positionsFor(issue).find(function (item) { return item.id === positionId; });
        if (!stance) return;
        var row = Array.from(el('ov-issue-list').querySelectorAll('.ov-issue')).find(function (node) { return node.dataset.issue === issueId; });
        if (!row) return;
        row.querySelectorAll('.ov-stance').forEach(function (node) { node.classList.toggle('is-preview', node.dataset.position === positionId); });
        row.querySelector('[data-stance-description]').innerHTML = '<h4>' + esc(stance.label) + '</h4><p>' + esc(stance.description) + '</p>';
        var current = candidatePosition(gameData.candidate, issue);
        row.querySelector('[data-stance-confirm]').innerHTML = current && current.id === positionId ? '' :
            '<div class="ov-confirm-line">' + button('stance-save', 'Adopt ' + esc(stance.label), 'data-issue="' + esc(issueId) + '" data-position="' + esc(positionId) + '"', 'ov-primary') +
            '<p>Changing an established position reduces credibility and favorability. Larger reversals have larger consequences.</p></div>';
    }
    function saveStance(issueId, positionId) {
        var result = IssueModel.setPosition(gameData.candidate && gameData.candidate.id, issueId, positionId, { playerAction: true });
        if (!result || !result.ok) { toast(result && result.error || 'The position could not be changed.'); return; }
        var issue = IssueModel.getIssue(issueId);
        var row = Array.from(el('ov-issue-list').querySelectorAll('.ov-issue')).find(function (node) { return node.dataset.issue === issueId; });
        if (row && issue) {
            var temporary = document.createElement('div');
            temporary.innerHTML = renderIssue(issue);
            var replacement = temporary.firstElementChild;
            replacement.open = true;
            row.replaceWith(replacement);
            var selected = replacement.querySelector('[aria-pressed="true"]');
            if (selected) selected.focus();
        }
        refreshHUD();
        toast('Your position on ' + issueName(issueId) + ' has been updated.');
    }

    function latestPoll(groupId) { return typeof GroupPolling !== 'undefined' && GroupPolling.latest ? GroupPolling.latest(groupId) : null; }
    function finiteNumber(value) { return typeof value === 'number' && isFinite(value) ? value : (value !== null && value !== '' && isFinite(Number(value)) ? Number(value) : null); }
    function baselineShare(group, candidate) {
        if (!group || !candidate) return null;
        // Prefer an explicitly versioned 2024 baseline. The legacy `support`
        // map is the simulator's original pre-campaign benchmark and remains
        // a compatible fallback for groups that do not carry versioned data.
        var sources = [group.support2024, group.baseline2024, group.baselineSupport2024, group.support];
        var party = candidate.party || candidate.voteKey;
        var aliases = { D: ['D', 'democratic', 'democrat'], R: ['R', 'republican'], I: ['I', 'independent'], G: ['G', 'green'], L: ['L', 'libertarian'], PSL: ['PSL'] };
        for (var si = 0; si < sources.length; si++) {
            var source = sources[si];
            if (!source) continue;
            var value = source[candidate.id];
            if (value === undefined && party) {
                var keys = aliases[party] || [party];
                for (var ki = 0; ki < keys.length && value === undefined; ki++) value = source[keys[ki]];
            }
            value = finiteNumber(value);
            if (value !== null) return value;
        }
        return null;
    }
    function candidateDelta(poll, group, candidate) {
        if (!poll || !group || !candidate || !poll.shares) return null;
        var current = finiteNumber(poll.shares[candidate.id]);
        var baseline = baselineShare(group, candidate);
        return current === null || baseline === null ? null : current - baseline;
    }
    function leadingOpponent(poll, target) {
        if (!poll || !target || !poll.shares) return null;
        return (poll.candidates || []).filter(function (candidate) {
            return candidate.id !== target.id && (!target.party || !candidate.party || candidate.party !== target.party);
        }).map(function (candidate) {
            return { candidate: candidate, share: finiteNumber(poll.shares[candidate.id]) };
        }).filter(function (item) { return item.share !== null; }).sort(function (a, b) { return b.share - a.share; })[0] || null;
    }
    function candidateMarginDelta(poll, group, target) {
        if (!poll || !group || !target || !poll.shares) return null;
        var targetPoll = (poll.candidates || []).find(function (candidate) { return candidate.id === target.id || (target.party && candidate.party === target.party); });
        var opponent = leadingOpponent(poll, targetPoll || target);
        if (!targetPoll || !opponent) return null;
        var currentMargin = finiteNumber(poll.shares[targetPoll.id]);
        var baselineTarget = baselineShare(group, targetPoll);
        var baselineOpponent = baselineShare(group, opponent.candidate);
        if (currentMargin === null || baselineTarget === null || baselineOpponent === null) return null;
        return (currentMargin - opponent.share) - (baselineTarget - baselineOpponent);
    }
    function movementSummary(poll, group, selectedCandidate) {
        if (!poll || !group) return '<span class="ov-movement-value ov-movement-neutral" aria-label="No 2024 baseline">—</span>';
        var candidates = poll.candidates || [];
        var target = selectedCandidate || gameData.candidate;
        if (target) {
            var targetMarginDelta = candidateMarginDelta(poll, group, target);
            if (targetMarginDelta !== null) {
                var targetClass = targetMarginDelta > 0.05 ? 'ov-movement-positive' : (targetMarginDelta < -0.05 ? 'ov-movement-negative' : 'ov-movement-neutral');
                var targetLabel = (targetMarginDelta > 0 ? '+' : '') + number(targetMarginDelta, 1) + ' pts';
                return '<span class="ov-movement-value ' + targetClass + '" title="Change in your candidate’s margin versus the 2024 reference margin; undecided voters are excluded from the poll margin">' + targetLabel + '</span>';
            }
            return '<span class="ov-movement-value ov-movement-neutral" aria-label="No benchmark margin movement for the selected candidate">—</span>';
        }
        var deltas = candidates.map(function (candidate) { return { candidate: candidate, delta: candidateDelta(poll, group, candidate) }; }).filter(function (item) { return item.delta !== null; });
        if (!deltas.length) return '<span class="ov-movement-value ov-movement-neutral" aria-label="No 2024 baseline">—</span>';
        deltas.sort(function (a, b) { return Math.abs(b.delta) - Math.abs(a.delta); });
        var item = deltas[0], delta = item.delta;
        var cls = delta > 0.05 ? 'ov-movement-positive' : (delta < -0.05 ? 'ov-movement-negative' : 'ov-movement-neutral');
        var label = (delta > 0 ? '+' : '') + number(delta, 1) + ' pts';
        return '<span class="ov-movement-value ' + cls + '" title="Candidate movement versus the 2024 benchmark">' + label + '</span>';
    }
    function pollRows(poll, compact, group) {
        if (!poll) return empty('No national group poll has been published yet.');
        var candidates = (poll.candidates || []).slice().sort(function (a, b) { return Number(poll.shares[b.id] || 0) - Number(poll.shares[a.id] || 0); });
        return '<div class="ov-poll-rows' + (compact ? ' ov-poll-compact' : '') + '">' + candidates.map(function (candidate) {
            var share = Number(poll.shares[candidate.id] || 0);
            var width = Math.max(0, Math.min(100, share));
            var delta = candidateDelta(poll, group, candidate);
            var deltaClass = delta === null ? 'ov-movement-neutral' : (delta > 0.05 ? 'ov-movement-positive' : (delta < -0.05 ? 'ov-movement-negative' : 'ov-movement-neutral'));
            var deltaText = delta === null ? '—' : (delta > 0 ? '+' : '') + number(delta, 1);
            return '<div class="ov-poll-row"><span class="ov-poll-name"><i aria-hidden="true" style="background:' + color(candidate.party) + '"></i>' + esc(candidate.name) + '</span><span class="ov-poll-value"><strong>' + number(share) + '%</strong><small class="ov-poll-delta ' + deltaClass + '" title="Change versus 2024 benchmark">' + deltaText + '</small></span>' +
                '<span class="ov-poll-track" aria-hidden="true"><span style="width:' + width + '%;background:' + color(candidate.party) + '"></span></span></div>';
        }).join('') + '<div class="ov-poll-undecided"><span>Undecided</span><span>' + number(poll.undecided || 0) + '%</span></div></div>';
    }
    function pollStamp(poll) {
        return poll ? '<div class="ov-poll-stamp"><span>National · Week ' + esc(poll.week) + '</span><strong>±' + number(poll.moe, 2) + ' pts</strong></div>' : '';
    }
    function renderGroups(category) {
        if (category) ui.groupCategory = category;
        var body = dialog('ov-groups', 'Interest groups & PACs', true);
        var groups = groupMap();
        var categories = Array.from(new Set(Object.keys(groups).map(function (id) { return groups[id].category; })));
        body.innerHTML = '<div class="ov-group-overview"><div><span class="ov-eyebrow">NATIONAL COALITION BRIEF</span><h3>Where support is moving</h3><p>Compare each community’s current modeled poll with its available 2024 benchmark. Turnout propensity reflects the campaign’s current issue and coalition effects.</p></div><div class="ov-group-overview-key"><span>Margin change since 2024</span><strong>↑ / ↓ percentage points</strong></div></div>' +
            '<p class="ov-intro">Explore voter communities and their published national polling. Expand broad categories to compare the communities within them.</p>' +
            '<nav class="ov-tabs" aria-label="Interest group categories">' + [{ id: 'all', name: 'All groups' }].concat(categories.map(function (category) { return { id: category, name: category }; }), [{ id: 'pacs', name: 'PACs' }]).map(function (tab) {
                return button('group-category', esc(tab.name), 'data-category="' + esc(tab.id) + '" aria-pressed="' + (tab.id === ui.groupCategory) + '"', 'ov-tab');
            }).join('') + '</nav>' + (ui.groupCategory === 'pacs' ? renderPACs() :
            '<label class="ov-search ov-group-search">Find a community<input type="search" id="ov-group-search" value="' + esc(ui.groupSearch) + '" placeholder="Search groups and origins…"></label>' +
            '<p class="ov-note">Groups overlap across race, religion, occupation, and age. Their shares cannot be added together. Policy preferences are modeled estimates, not Census measurements.</p>' +
            '<div id="ov-group-list">' + categories.filter(function (category) { return ui.groupCategory === 'all' || ui.groupCategory === category; }).map(function (category) {
                var parents = Object.keys(groups).filter(function (id) { return groups[id].category === category && !groups[id].parentId; });
                return '<section class="ov-group-section"><h3 class="ov-section-heading">' + esc(category) + '</h3>' + parents.map(function (id) { return renderGroupCard(id, true); }).join('') + '</section>';
            }).join('') + '</div><p id="ov-group-empty" class="ov-empty hidden">No communities match this search.</p>');
        if (ui.groupCategory !== 'pacs') filterGroups();
    }
    function renderGroupCard(id, parent) {
        var groups = groupMap();
        var group = groups[id];
        var children = Object.keys(groups).filter(function (childId) { return groups[childId].parentId === id; });
        var poll = latestPoll(id);
        var search = [group.name, group.description, children.map(function (childId) { return groups[childId].name; }).join(' ')].join(' ').toLowerCase();
        var turnout = gameData.interestGroupTurnout && finiteNumber(gameData.interestGroupTurnout[id]);
        var turnoutText = turnout === null ? '—' : number(turnout * 100, 0) + '%';
        return '<article class="ov-group-card' + (parent ? ' ov-group-parent' : ' ov-group-child') + '" data-search="' + esc(search) + '">' +
            '<div class="ov-group-copy"><div class="ov-group-card-heading"><div><span class="ov-eyebrow">' + esc(group.category || 'VOTER COMMUNITY') + '</span><h4>' + esc(group.name) + '</h4></div><div class="ov-group-movement"><span>Your candidate · margin change</span>' + movementSummary(poll, group) + '</div></div><p>' + esc(group.description || 'A voter community; see its issue preferences and national polling below.') + '</p>' +
            '<div class="ov-group-meta"><span><b>Turnout propensity</b> ' + turnoutText + '</span><span><b>Priority issues</b> ' + esc((group.priorities || []).slice(0, 3).map(issueName).join(' · ') || 'Not available') + '</span></div>' +
            button('group-detail', 'Poll history & issue preferences <span aria-hidden="true">↗</span>', 'data-group="' + esc(id) + '"', 'ov-text-button') + '</div>' +
            '<div class="ov-group-poll">' + pollStamp(poll) + pollRows(poll, true, group) + '</div>' +
            (children.length ? '<details class="ov-subgroups"><summary>Explore ' + children.length + ' communities within ' + esc(group.name) + '</summary><div class="ov-subgroup-list">' + children.map(function (childId) { return renderGroupCard(childId, false); }).join('') + '</div></details>' : '') + '</article>';
    }
    function filterGroups() {
        var list = el('ov-group-list');
        if (!list) return;
        var search = ui.groupSearch.toLowerCase().trim();
        var total = 0;
        list.querySelectorAll('.ov-group-section').forEach(function (section) {
            var visible = 0;
            section.querySelectorAll('.ov-group-parent').forEach(function (parent) {
                parent.hidden = parent.dataset.search.indexOf(search) === -1;
                if (!parent.hidden) visible++;
                var details = parent.querySelector('.ov-subgroups');
                if (details && search && !parent.hidden) details.open = true;
                parent.querySelectorAll('.ov-group-child').forEach(function (child) { child.hidden = !!search && child.dataset.search.indexOf(search) === -1; });
            });
            section.hidden = visible === 0;
            total += visible;
        });
        el('ov-group-empty').classList.toggle('hidden', total !== 0);
    }
    function renderPACs() {
        if (typeof PACS === 'undefined') return empty('PAC information is not available.');
        return '<div class="ov-pacs">' + Object.keys(PACS).map(function (id) {
            var pac = PACS[id];
            return '<article class="ov-pac"><div><span class="ov-eyebrow">POLITICAL ACTION COMMITTEE</span><h3>' + esc(pac.name) + '</h3><p>' + esc(pac.description) + '</p></div>' +
                '<dl><div><dt>Priority</dt><dd>' + esc(issueName(pac.priority_issue)) + '</dd></div><div><dt>Contribution</dt><dd>$' + number(pac.contribution) + 'M</dd></div></dl></article>';
        }).join('') + '</div>';
    }
    function openGroup(id) {
        var group = groupMap()[id];
        if (!group) return;
        ui.groupId = id;
        var body = dialog('ov-group-detail', group.name, true);
        body.innerHTML = renderGroupDetail(id);
        openDialog('ov-group-detail');
    }
    function renderGroupDetail(id) {
        var group = groupMap()[id];
        if (!group) return empty('This group is unavailable.');
        var poll = latestPoll(id);
        var history = gameData.groupPolls && gameData.groupPolls[id] || [];
        return '<p class="ov-intro">' + esc(group.description) + '</p><div class="ov-detail-poll-layout"><section><h3 class="ov-section-heading">Latest national group poll</h3>' +
            '<div class="ov-detail-movement"><span>Your candidate · margin change since 2024</span>' + movementSummary(poll, group) + '</div>' + pollStamp(poll) + pollRows(poll, false, group) + '</section><aside class="ov-methodology"><h3>Reading this poll</h3>' +
            (poll ? '<dl class="ov-facts"><div><dt>Fielded</dt><dd>Week ' + esc(poll.week) + (poll.date ? ' · ' + esc(poll.date) : '') + '</dd></div><div><dt>Confidence level</dt><dd>' + number((poll.confidenceLevel || 0.95) * 100, 0) + '%</dd></div>' +
            '<div><dt>Respondents</dt><dd>' + number(poll.sampleSize, 0) + '</dd></div><div><dt>Effective sample</dt><dd>' + number(poll.effectiveSampleSize, 0) + '</dd></div><div><dt>Margin of error</dt><dd>±' + number(poll.moe, 2) + ' percentage points</dd></div></dl>' +
            '<p>Sampling uncertainty applies to each candidate estimate. An interval for a lead can be wider than one candidate’s margin of error.</p>' +
            ((poll.adjustments || []).length ? '<h4>Uncertainty factors</h4><ul>' + poll.adjustments.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('') + '</ul>' : '') :
            '<p>A poll will appear when the simulation publishes its next national group survey.</p>') +
            '<p>These are simulated surveys of this group nationwide. Reopening this panel does not conduct a new poll.</p>' + (poll && poll.methodology ? '<p>' + esc(poll.methodology) + '</p>' : '') + '</aside></div>' +
            '<h3 class="ov-section-heading">Weekly polling history</h3>' + renderPollHistory(history) +
            '<h3 class="ov-section-heading">Issue priorities & opinion diversity</h3>' +
            notice('Modeled assumptions: Census counts describe populations, not their political opinions. Each distribution represents variation within the community; the mean is not a unanimous position. Campaign activity can change an issue’s importance.') +
            '<label class="ov-search">Find an issue in this group<input id="ov-preference-search" type="search" placeholder="Search issue preferences…"></label><div id="ov-preference-list">' +
            issueList().map(function (issue) { return renderPreference(id, issue); }).join('') + '</div><p class="ov-empty hidden" id="ov-preference-empty">No issue preferences match your search.</p>';
    }
    function renderFinalResultsGroup(id) {
        var group = groupMap()[id];
        if (!group) return '';
        var poll = latestPoll(id);
        var children = Object.keys(groupMap()).filter(function (childId) { return groupMap()[childId].parentId === id; });
        var turnout = gameData.interestGroupTurnout && finiteNumber(gameData.interestGroupTurnout[id]);
        return '<article class="ig-results-card"><header><div><span class="ov-eyebrow">' + esc(group.category || 'VOTER COMMUNITY') + '</span><h3>' + esc(group.name) + '</h3></div><div class="ov-group-movement"><span>Your candidate · 2024</span>' + movementSummary(poll, group) + '</div></header>' +
            '<p>' + esc(group.description || 'A modeled voter community.') + '</p><div class="ig-results-meta"><span>Turnout propensity <strong>' + (turnout === null ? '—' : number(turnout * 100, 0) + '%') + '</strong></span><span>Priority issues <strong>' + esc((group.priorities || []).slice(0, 3).map(issueName).join(' · ') || 'Not available') + '</strong></span></div>' +
            '<div class="ig-results-poll">' + pollStamp(poll) + pollRows(poll, true, group) + '</div>' +
            (children.length ? '<details class="ig-results-subgroups"><summary>Detailed communities (' + children.length + ')</summary><div>' + children.map(renderFinalResultsGroup).join('') + '</div></details>' : '') + '</article>';
    }
    function renderFinalResultsPanel() {
        var groups = groupMap();
        var parentIds = Object.keys(groups).filter(function (id) { return !groups[id].parentId; });
        if (!parentIds.length) return '';
        var categories = Array.from(new Set(parentIds.map(function (id) { return groups[id].category || 'Voter communities'; })));
        return '<section class="campaign-summary ig-results-panel" aria-labelledby="final-interest-groups-title"><div class="ig-results-header"><div><span class="ov-eyebrow">FINAL COALITION SNAPSHOT</span><h2 id="final-interest-groups-title">INTEREST GROUP RESULTS</h2><p>Current national group polls, turnout propensity, and movement against the available 2024 baseline at the close of the campaign.</p></div><div class="ig-results-legend"><span class="ov-movement-positive">Positive movement</span><span class="ov-movement-negative">Negative movement</span><span>— No baseline</span></div></div>' +
            categories.map(function (category) { return '<section class="ig-results-category"><h3>' + esc(category) + '</h3><div class="ig-results-grid">' + parentIds.filter(function (id) { return (groups[id].category || 'Voter communities') === category; }).map(renderFinalResultsGroup).join('') + '</div></section>'; }).join('') +
            '<p class="ig-results-footnote">Groups overlap across race, religion, occupation, age, and political identity; their population shares should not be added together. These are modeled simulation estimates.</p></section>';
    }
    function renderPollHistory(history) {
        if (!history.length) return empty('No weekly surveys have been published for this group.');
        var candidates = [];
        history.forEach(function (poll) { (poll.candidates || []).forEach(function (candidate) { if (!candidates.some(function (known) { return known.id === candidate.id; })) candidates.push(candidate); }); });
        return '<div class="ov-table-scroll" tabindex="0" aria-label="Weekly polling history, scroll horizontally for all candidates"><table class="ov-table"><caption>Published national surveys; older observations remain fixed.</caption><thead><tr><th scope="col">Week</th>' +
            candidates.map(function (candidate) { return '<th scope="col">' + esc(candidate.name) + '</th>'; }).join('') + '<th scope="col">Undecided</th><th scope="col">MOE</th><th scope="col">Sample</th></tr></thead><tbody>' +
            history.slice().reverse().map(function (poll) {
                return '<tr><th scope="row">' + esc(poll.week) + '</th>' + candidates.map(function (candidate) { return '<td>' + (poll.shares[candidate.id] == null ? '—' : number(poll.shares[candidate.id]) + '%') + '</td>'; }).join('') +
                    '<td>' + number(poll.undecided || 0) + '%</td><td>±' + number(poll.moe, 2) + '</td><td>' + number(poll.sampleSize, 0) + '</td></tr>';
            }).join('') + '</tbody></table></div>';
    }
    function renderPreference(id, issue) {
        var profile = typeof Electorate !== 'undefined' && Electorate.profile ? Electorate.profile(id, issue.id) : null;
        if (!profile) return '';
        var positions = positionsFor(issue);
        var mode = positions.find(function (position) { return position.id === profile.mode; });
        var mean = Number(profile.mean);
        // Opinion means use -3…3; stance.value is legacy compatibility data on
        // -9…9. Match the seven ordered categories, never the legacy values.
        var nearest = positions[Math.max(0, Math.min(positions.length - 1, Math.round(mean + 3)))];
        var importance = Math.max(0, Math.min(100, Number(profile.importance) || 0));
        return '<details class="ov-preference" data-search="' + esc((issue.name + ' ' + issue.category).toLowerCase()) + '"><summary><span><strong>' + esc(issue.name) + '</strong><small>' + esc(issue.category) + ' · Average near ' + esc(nearest ? nearest.label : 'Center') + '</small></span>' +
            '<span class="ov-salience"><span>Importance <strong>' + number(importance, 0) + '/100</strong></span><meter min="0" max="100" value="' + importance + '" aria-label="Issue importance">' + number(importance, 0) + '</meter></span></summary>' +
            '<div class="ov-preference-body"><p>' + esc(profile.description || 'This modeled opinion distribution reflects variation within the community.') + '</p>' +
            '<div class="ov-preference-stats"><span>Most common position: <strong>' + esc(mode ? mode.label : 'Unavailable') + '</strong></span><span>Baseline importance: <strong>' + number(profile.baselineImportance, 0) + '/100</strong></span></div>' +
            '<div class="ov-distribution" aria-label="Modeled distribution of policy positions">' + positions.map(function (position, index) {
                var share = Math.max(0, Math.min(100, Number((profile.distribution || [])[index] || 0) * 100));
                return '<div><span>' + esc(position.label) + '</span><span class="ov-distribution-track"><i style="width:' + share + '%"></i></span><strong>' + number(share) + '%</strong></div>';
            }).join('') + '</div><p class="ov-note">Model estimate · Preferences within a group vary.</p></div></details>';
    }

    function selectedCounty() {
        if (typeof Counties === 'undefined' || !Counties.countyData || !gameData.selectedCounty) return null;
        return Counties.countyData[gameData.selectedCounty] || null;
    }
    function marketEntries() {
        return typeof MEDIA_MARKETS === 'undefined' ? [] : Object.keys(MEDIA_MARKETS).map(function (id) {
            var market = MEDIA_MARKETS[id];
            return { id: market.id || id, name: market.label || market.name || id, reach: market.reach };
        }).sort(function (a, b) { return a.name.localeCompare(b.name); });
    }
    function option(value, name, selected) { return '<option value="' + esc(value) + '"' + (String(value) === String(selected) ? ' selected' : '') + '>' + esc(name) + '</option>'; }
    function adSystemReady() { return typeof AdEngine !== 'undefined' && typeof AdEngine.quote === 'function' && typeof AdEngine.buy === 'function'; }
    function quoteAd(payload) {
        if (!adSystemReady()) return { ok: false, error: 'The ad engine is still initializing. The composer will become available automatically.' };
        try { return AdEngine.quote(payload); }
        catch (error) { console.error('Ad composer quote failed.', error); return { ok: false, error: 'This ad could not be priced. Reopen the composer or choose another market.' }; }
    }
    function openAds(options) {
        options = options || {};
        var county = selectedCounty();
        var candidates = activeCandidates().filter(function (candidate) { return !gameData.candidate || candidate.id !== gameData.candidate.id; });
        var markets = marketEntries();
        ui.adConfig = Object.assign({
            channel: markets.length ? (options.channel || 'tv') : 'digital', type: options.type === 'bio' ? 'positive' : options.type || 'issue',
            issueId: issueList().length ? issueList()[0].id : '', targetId: candidates.length ? candidates[0].id : '',
            intensity: 1, durationWeeks: 1, budget: 2,
            marketId: county && county.mediaMarket || (markets[0] && markets[0].id) || '',
            stateCode: gameData.selectedState || county && county.s || 'PA',
            sponsorId: gameData.candidate && gameData.candidate.id, segment: ''
        }, options);
        if (!markets.length && ui.adConfig.channel === 'tv') ui.adConfig.channel = 'digital';
        if (ui.adConfig.type === 'bio') ui.adConfig.type = 'positive';
        ui.lastAdMessage = '';
        renderAds();
        openDialog('ov-ads');
    }
    function renderAds() {
        var body = dialog('ov-ads', 'Build an advertising campaign', true);
        var config = ui.adConfig;
        if (!config) { body.innerHTML = empty('The ad composer could not be configured.'); return; }
        var opponents = activeCandidates().filter(function (candidate) { return !gameData.candidate || candidate.id !== gameData.candidate.id; });
        var markets = marketEntries();
        var states = typeof STATES === 'undefined' ? {} : STATES;
        var groups = groupMap();
        var categories = Array.from(new Set(issueList().map(function (issue) { return issue.category; })));
        body.innerHTML = '<p class="ov-intro">Choose the message, audience, and time on air. Policy ads raise issue importance; attacks can persuade, mobilize, or backfire depending on the audience and the candidates’ actual positions.</p>' +
            '<div class="ov-preset-bar" style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:10px; background:rgba(0,0,0,0.3); border:1px solid #444; border-radius:6px; padding:8px 12px; margin-bottom:12px;">' +
                '<div style="display:flex; align-items:center; gap:8px;">' +
                    '<span style="font-size:0.75rem; color:#5bc0de; font-weight:bold;"><i class="fas fa-bookmark"></i> Preset:</span>' +
                    '<select id="ov-preset-loader" style="background:#222; color:#fff; border:1px solid #555; border-radius:4px; font-size:0.75rem; padding:4px;" onchange="app.loadPresetIntoAdComposer(this.value)">' +
                        '<option value="">-- Load Saved Preset --</option>' +
                        (typeof AdPresets !== 'undefined' ? AdPresets.getPresets().map(function(p){ return '<option value="' + p.id + '">' + p.name + '</option>'; }).join('') : '') +
                    '</select>' +
                '</div>' +
                '<div style="display:flex; align-items:center; gap:6px;">' +
                    '<input type="text" id="ov-preset-name-input" placeholder="Preset name..." style="background:#222; color:#fff; border:1px solid #555; border-radius:4px; font-size:0.75rem; padding:4px 8px; width:150px;">' +
                    '<button type="button" class="ov-button" style="padding:4px 10px; font-size:0.75rem;" onclick="app.saveComposerAdPreset()">Save As Preset</button>' +
                '</div>' +
            '</div>' +
            '<div class="ov-ad-layout"><form id="ov-ad-form"><div class="ov-form-grid">' +
            '<label>Channel<select name="channel">' + option('tv', 'Television', config.channel) + option('digital', 'Digital', config.channel) + '</select></label>' +
            '<label class="ov-ad-message-field">Message<select name="type">' + option('issue', 'Policy advocacy', config.type) + option('attack', 'Attack an opponent’s policy', config.type) + option('positive', 'Candidate introduction', config.type) + option('mobilize', 'Turn out supporters', config.type) + '</select></label>' +
            '<label id="ov-market-field">Media market<select name="marketId">' + (markets.length ? markets.map(function (market) { return option(market.id, market.name, config.marketId); }).join('') : '<option value="">No markets loaded</option>') + '</select></label>' +
            '<label id="ov-state-field">State<select name="stateCode">' + Object.keys(states).sort(function (a, b) { return states[a].name.localeCompare(states[b].name); }).map(function (id) { return option(id, states[id].name, config.stateCode); }).join('') + '</select></label>' +
            '<label id="ov-target-field" class="ov-span-all">Opponent<select name="targetId">' + (opponents.length ? opponents.map(function (candidate) { return option(candidate.id, candidate.name + ' (' + candidate.party + ')', config.targetId); }).join('') : '<option value="">No opponent is available</option>') + '</select></label>' +
            '<label id="ov-frame-field" class="ov-span-all">Political frame<select name="frame">' + option('', 'No added frame', config.frame) + option('socialism', 'Socialism / government-control contrast', config.frame) + '</select><small>Available only for an attack aimed at a configured subgroup when the opponent’s recorded platform supports the contrast.</small></label>' +
            '<label id="ov-ad-issue-field" class="ov-span-all">Issue<select name="issueId">' + categories.map(function (category) { return '<optgroup label="' + esc(category) + '">' + issueList().filter(function (issue) { return issue.category === category; }).sort(function (a, b) { var ap = typeof CampaignPriorities !== 'undefined' && gameData.candidate && CampaignPriorities.has(gameData.candidate, a.id); var bp = typeof CampaignPriorities !== 'undefined' && gameData.candidate && CampaignPriorities.has(gameData.candidate, b.id); return (bp ? 1 : 0) - (ap ? 1 : 0); }).map(function (issue) { return option(issue.id, issueOptionLabel(issue), config.issueId); }).join('') + '</optgroup>'; }).join('') + '</select></label>' +
            '<label>Intensity<select name="intensity">' + option(1, 'Standard', config.intensity) + option(2, 'High', config.intensity) + option(3, 'Saturation', config.intensity) + '</select></label>' +
            '<label>Duration<select name="durationWeeks">' + [1, 2, 3, 4].map(function (weeks) { return option(weeks, weeks + (weeks === 1 ? ' week' : ' weeks'), config.durationWeeks); }).join('') + '</select></label>' +
            '<label id="ov-budget-field">Total digital budget ($M)<input name="budget" type="number" min="0.1" max="1000" step="0.1" value="' + esc(config.budget) + '"></label>' +
            '<label id="ov-segment-field" class="ov-span-all">Audience<select name="segment">' + option('', 'Broad state audience', config.segment) + Object.keys(groups).map(function (id) { return option(id, groups[id].name, config.segment); }).join('') + '</select></label></div>' +
            '<div class="ov-ad-checkout"><div id="ov-ad-quote" aria-live="polite"></div><button class="ov-button ov-primary" id="ov-ad-buy" type="submit">Launch campaign</button></div><p class="ov-form-message" id="ov-ad-message" role="status">' + esc(ui.lastAdMessage) + '</p></form>' +
            '<aside class="ov-ad-preview" id="ov-ad-preview" aria-live="polite"></aside></div>' +
            '<h3 class="ov-section-heading">Advertising activity</h3><div id="ov-ad-history">' + renderAdHistory() + '</div>';
        updateAdPreview();
    }
    function readAdForm() {
        var form = el('ov-ad-form');
        if (!form) return ui.adConfig;
        new FormData(form).forEach(function (value, key) {
            ui.adConfig[key] = ['intensity', 'durationWeeks', 'budget'].indexOf(key) !== -1 ? Number(value) : value;
        });
        return ui.adConfig;
    }
    function adPayload() {
        var config = Object.assign({}, readAdForm());
        if (config.channel === 'tv') { delete config.stateCode; delete config.budget; delete config.segment; }
        else delete config.marketId;
        if (config.type !== 'attack') delete config.targetId;
        if (config.type !== 'attack' || config.channel !== 'digital') delete config.frame;
        if (config.type === 'positive' || config.type === 'mobilize') delete config.issueId;
        if (!config.segment) delete config.segment;
        return config;
    }
    function updateAdPreview() {
        var config = readAdForm();
        if (!config) return;
        var isDigital = config.channel === 'digital';
        var policy = config.type === 'attack' || config.type === 'issue';
        el('ov-market-field').hidden = isDigital;
        el('ov-state-field').hidden = !isDigital;
        el('ov-budget-field').hidden = !isDigital;
        el('ov-segment-field').hidden = !isDigital;
        el('ov-target-field').hidden = config.type !== 'attack';
        el('ov-frame-field').hidden = config.type !== 'attack' || !isDigital;
        el('ov-ad-issue-field').hidden = !policy;
        var issue = typeof IssueModel !== 'undefined' ? IssueModel.getIssue(config.issueId) : null;
        var target = activeCandidates().find(function (candidate) { return candidate.id === config.targetId; });
        var sponsor = gameData.candidate;
        var html = '<span class="ov-eyebrow">MESSAGE PREVIEW</span><h3>' + esc(config.type === 'attack' ? 'The policy contrast' : config.type === 'issue' ? 'Your policy message' : config.type === 'positive' ? 'Introduce your candidate' : 'Get supporters to the polls') + '</h3>';
        if (sponsor) html += renderAdCandidate(sponsor, issue, 'Sponsored by', policy);
        if (config.type === 'attack') html += target ? renderAdCandidate(target, issue, 'Selected opponent', true) : notice('Select an active opponent to continue.');
        if (policy && issue) html += '<p class="ov-note">' + esc(issue.name) + ': ' + esc(issue.description) + '</p>';
        if (config.type === 'attack' && isDigital && config.frame === 'socialism') html += '<p class="ov-note">This contrast is evaluated against the opponent’s recorded economic-system positions and only affects a selected subgroup configured for this scenario response.</p>';
        html += '<p class="ov-note">The first delivery happens on launch; remaining deliveries run weekly. Greater intensity can increase visibility, fatigue, and backlash; a purchase does not guarantee votes.</p>';
        el('ov-ad-preview').innerHTML = html;
        var quote = quoteAd(adPayload());
        el('ov-ad-buy').disabled = !quote || !quote.ok;
        el('ov-ad-quote').innerHTML = quote && quote.ok ? '<span>Total cost</span><strong>$' + number(quote.cost, 2) + 'M</strong><small>' + esc(config.durationWeeks) + (config.durationWeeks === 1 ? ' week' : ' weeks') + ' · 1 energy · charged on launch</small>' :
            '<p class="ov-error">' + esc(quote && quote.error || 'A price is not available for this configuration.') + '</p>';
    }
    function renderAdCandidate(candidate, issue, label, policy) {
        var position = policy && issue ? candidatePosition(candidate, issue) : null;
        return '<article class="ov-ad-candidate" style="--candidate-color:' + color(candidate.party) + '"><span class="ov-eyebrow">' + esc(label) + '</span><div class="ov-person">' + portrait(candidate, true) + '<span><h4>' + esc(candidate.name) + '</h4><small>' + esc(candidate.party) + (position ? ' · ' + esc(position.label) : '') + '</small></span></div>' +
            (position ? '<p>' + esc(position.description) + '</p>' : '') + '</article>';
    }
    function buyAd() {
        if (!adSystemReady()) { el('ov-ad-message').textContent = 'The ad engine is still initializing. Try again in a moment.'; el('ov-ad-message').classList.add('ov-error'); return; }
        var result;
        try { result = AdEngine.buy(adPayload()); }
        catch (error) { console.error('Ad purchase failed.', error); result = { ok: false, error: 'This ad could not be launched. Reopen the composer and try again.' }; }
        if (!result || !result.ok) {
            el('ov-ad-message').textContent = result && result.error || 'The campaign could not be purchased.';
            el('ov-ad-message').classList.add('ov-error');
            updateAdPreview();
            return;
        }
        ui.lastAdMessage = 'Campaign launched. $' + number(result.cost, 2) + 'M and 1 energy spent; first delivery completed.';
        el('ov-ad-message').textContent = ui.lastAdMessage;
        el('ov-ad-message').classList.remove('ov-error');
        el('ov-ad-history').innerHTML = renderAdHistory();
        refreshHUD();
        updateAdPreview();
    }
    function renderAdHistory() {
        var campaigns = gameData.ads && gameData.ads.campaigns || [];
        if (!campaigns.length) return empty('No advertising campaigns have been purchased. Your active campaigns and completed buys will appear here.');
        var candidates = activeCandidates();
        return '<div class="ov-table-scroll" tabindex="0" aria-label="Advertising activity"><table class="ov-table"><caption>Active and completed advertising campaigns</caption><thead><tr><th>Sponsor</th><th>Message</th><th>Audience</th><th>Opponent</th><th>Delivery</th><th>Cost</th></tr></thead><tbody>' +
            campaigns.slice().reverse().map(function (campaign) {
                var target = candidates.find(function (candidate) { return candidate.id === campaign.targetId; });
                var market = typeof MEDIA_MARKETS !== 'undefined' && MEDIA_MARKETS[campaign.marketId];
                var state = typeof STATES !== 'undefined' && STATES[campaign.stateCode];
                var location = campaign.channel === 'tv' ? market && (market.label || market.name) || campaign.marketId : state && state.name || campaign.stateCode;
                var segment = groupMap()[campaign.segment];
                return '<tr><td>' + esc(campaign.sponsorName || campaign.sponsorId || 'Unavailable') + '</td><td><strong>' + esc({ attack: 'Policy attack', issue: 'Policy advocacy', positive: 'Introduction', mobilize: 'Mobilization' }[campaign.type] || campaign.type) + '</strong><small>' + esc(campaign.issueId ? issueName(campaign.issueId) : '') + '</small></td>' +
                    '<td>' + esc(campaign.channel === 'tv' ? 'TV' : 'Digital') + ' · ' + esc(location || 'Unavailable') + (segment ? '<small>' + esc(segment.name) + '</small>' : '') + '</td>' +
                    '<td>' + esc(target ? target.name : campaign.targetName || campaign.targetId || '—') + '</td><td><span class="ov-status">' + esc(campaign.status || (campaign.weeksRemaining > 0 ? 'Active' : 'Completed')) + '</span><small>' + number(campaign.deliveredWeeks || 0, 0) + ' delivered · ' + number(campaign.weeksRemaining || 0, 0) + ' left</small></td><td>$' + number(campaign.cost, 2) + 'M</td></tr>';
            }).join('') + '</tbody></table></div>';
    }

    function openCounty(fips) {
        var county = typeof Counties !== 'undefined' && Counties.countyData && Counties.countyData[fips || gameData.selectedCounty];
        if (!county) { toast('Select a county to read its profile.'); return; }
        var body = dialog('ov-county', county.n || county.name || 'County profile', false);
        var profile = county.profile;
        if (!profile) body.innerHTML = empty('A sourced profile is not available for this county yet.');
        else {
            var sources = (profile.sources || []).map(function (source) {
                var url = safeURL(source.url, false);
                return '<li>' + (url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(source.title || 'Source') + '</a>' : esc(source.title || source)) + '</li>';
            }).join('');
            var text = countyProfileParagraphs(profile);
            body.innerHTML = '<span class="ov-eyebrow">COUNTY FIELD GUIDE · ' + esc(county.s || '') + '</span>' +
                '<p class="ov-intro">' + esc(profile.summary) + '</p><dl class="ov-county-facts"><div><dt>Population</dt><dd>' + number(county.p, 0) + '</dd></div><div><dt>County type</dt><dd>' + esc(typeof Utils !== 'undefined' && Utils.getDisplayTier ? Utils.getDisplayTier(county.t) : county.t || 'Unavailable') + '</dd></div></dl>' +
                '<div class="ov-prose ov-county-text">' + text.filter(Boolean).map(function (paragraph) { return '<p>' + esc(paragraph) + '</p>'; }).join('') + '</div>' +
                renderCountyDemographics(county) +
                '<aside class="ov-methodology"><h3>About this profile</h3><p>' + esc(profile.status || 'Compiled from county data; political interpretation is a simulation assumption.') + '</p>' +
                (sources ? '<h4>Sources</h4><ul>' + sources + '</ul>' : '') + '</aside>';
        }
        openDialog('ov-county');
    }
    function countyProfileParagraphs(profile) {
        var paragraphs = (Array.isArray(profile.text) ? profile.text : String(profile.text || '').split(/\n\s*\n/)).map(function (paragraph) { return String(paragraph).trim(); }).filter(Boolean);
        var summary = String(profile.summary || '').trim();
        if (summary && paragraphs.length && paragraphs[0].indexOf(summary) === 0) paragraphs[0] = paragraphs[0].slice(summary.length).trim();
        // Preserve the sourced wording while separating employment context,
        // household conditions, and the explicitly modeled electoral reading.
        return paragraphs.reduce(function (result, paragraph) {
            return result.concat(paragraph.replace(/\s+(?=Median household income|The imported electoral scenario baseline)/g, '\n\n').split(/\n\s*\n/));
        }, []).map(function (paragraph) { return paragraph.trim(); }).filter(Boolean);
    }
    function renderCountyDemographics(county) {
        var demographics = county.demographics;
        if (!demographics) return '';
        // Metadata is explanatory only; never infer an electorate from resident counts here.
        var lines = [];
        var labels = { source: 'Source', vintage: 'Vintage', universe: 'Population universe', status: 'Status', notes: 'Notes', methodology: 'Methodology', method: 'Population method', legacyMemberships: 'Legacy memberships', geography: 'Geography' };
        Object.keys(labels).forEach(function (key) {
            var value = demographics[key];
            if (typeof value === 'string' || typeof value === 'number') lines.push('<div><dt>' + esc(labels[key]) + '</dt><dd>' + esc(value) + '</dd></div>');
        });
        return lines.length ? '<details class="ov-demographic-method"><summary>Demographic data & limitations</summary><dl class="ov-facts">' + lines.join('') + '</dl></details>' : '';
    }
    function addCountyButton() {
        if (!selectedCounty()) return;
        refreshTvMarketLabel();
        var issueSelect = el('tv-ad-issue');
        if (issueSelect) {
            var selected = issueSelect.value;
            issueSelect.setAttribute('aria-label', 'Television campaign issue');
            issueSelect.innerHTML = '<option value="">Select an issue…</option>' + issueList().slice().sort(function (a, b) { var ap = typeof CampaignPriorities !== 'undefined' && gameData.candidate && CampaignPriorities.has(gameData.candidate, a.id); var bp = typeof CampaignPriorities !== 'undefined' && gameData.candidate && CampaignPriorities.has(gameData.candidate, b.id); return (bp ? 1 : 0) - (ap ? 1 : 0); }).map(function (issue) { return option(issue.id, issueOptionLabel(issue), selected); }).join('');
        }
        var tvContainer = el('tv-ads-container');
        if (tvContainer) Array.from(tvContainer.children).forEach(function (child) {
            if (child.tagName === 'DIV' && child.textContent.indexOf('Select an ad type') === 0) child.textContent = 'Choose a message to review your audience, cost, and duration before launch.';
        });
        var area = el('sp-issues-list');
        if (area && !el('ov-county-profile-button')) {
            var profileButton = document.createElement('button');
            profileButton.id = 'ov-county-profile-button';
            profileButton.className = 'ov-button ov-county-profile-button';
            profileButton.type = 'button';
            profileButton.dataset.ovAction = 'county-profile';
            profileButton.textContent = 'Read county profile ↗';
            area.appendChild(profileButton);
        }
    }
    function refreshTvMarketLabel() {
        var county = selectedCounty(), label = el('tv-ads-market');
        if (!label) return;
        var market = county && typeof MEDIA_MARKETS !== 'undefined' && MEDIA_MARKETS[county.mediaMarket];
        label.textContent = market ? market.name || market.label || 'Selected media market' : 'No market assigned';
    }

    function wire() {
        if (typeof app === 'undefined') return;
        app.openIssuesPanel = function () { hideLegacy('issues-modal'); renderIssues(); openDialog('ov-issues'); };
        app.closeIssuesPanel = function () { closeDialog('ov-issues'); hideLegacy('issues-modal'); };
        app.renderIssuesPanel = renderIssues;
        app.shiftIssuePosition = function (id) {
            // Legacy shortcuts open the named-position controls; never fall back
            // to the old numeric position prompt, including legacy issue aliases.
            ui.issueSearch = '';
            ui.issueCategory = 'all';
            app.openIssuesPanel();
            var list = el('ov-issue-list');
            if (!list) return;
            var issue = typeof IssueModel !== 'undefined' && IssueModel.getIssue(id);
            var canonicalId = issue ? issue.id : id;
            var row = Array.from(list.querySelectorAll('.ov-issue')).find(function (node) { return node.dataset.issue === canonicalId; });
            if (row) {
                row.open = true;
                window.requestAnimationFrame(function () {
                    row.scrollIntoView({ block: 'center' });
                    row.querySelector('summary').focus();
                });
            }
        };
        app.openInterestGroups = function () { hideLegacy('interest-groups-modal'); ui.groupSearch = ''; ui.groupCategory = 'all'; renderGroups(); openDialog('ov-groups'); };
        app.closeInterestGroups = function () { closeDialog('ov-groups'); hideLegacy('interest-groups-modal'); };
        app.renderInterestGroups = renderGroups;
        app.filterInterestGroups = renderGroups;
        app.openInterestGroupDetail = openGroup;
        app.closeInterestGroupDetail = function () { closeDialog('ov-group-detail'); hideLegacy('interest-group-detail-modal'); };
        app.renderInterestGroupDetail = renderGroupDetail;
        app.renderCandidateSupport = function (id) { return pollRows(latestPoll(id), true, groupMap()[id]); };
        app.openAdsModal = openAds;
        app.closeAdsModal = function () { closeDialog('ov-ads'); };
        if (app.renderTvAdsMode && !app.renderTvAdsMode.overhaulUIWrapped) {
            var renderTvAdsMode = app.renderTvAdsMode;
            app.renderTvAdsMode = function () { var result = renderTvAdsMode.apply(this, arguments); refreshTvMarketLabel(); return result; };
            app.renderTvAdsMode.overhaulUIWrapped = true;
        }
        app.runTvAd = function (type) {
            var county = selectedCounty();
            var issue = el('tv-ad-issue');
            var options = { channel: 'tv', type: type === 'bio' ? 'positive' : type };
            if (county && county.mediaMarket) options.marketId = county.mediaMarket;
            if (issue && issue.value) options.issueId = issue.value;
            openAds(options);
        };
        app.updateTvAdIssueScores = function () {
            var select = el('tv-ad-issue'), output = el('tv-ad-issue-scores');
            if (!output) return;
            var issue = select && typeof IssueModel !== 'undefined' && IssueModel.getIssue(select.value);
            var position = issue && candidatePosition(gameData.candidate, issue);
            output.textContent = position ? 'Your position: ' + position.label + '. Compare opponents in the ad composer.' : '';
        };
        app.openDigitalModal = function () { hideLegacy('digital-planner-modal'); openAds({ channel: 'digital' }); };
        app.closeDigitalModal = function () { closeDialog('ov-ads'); hideLegacy('digital-planner-modal'); };
        app.runDigitalPreset = function (preset) { openAds({ channel: 'digital', type: preset === 'base' ? 'mobilize' : preset === 'attack' ? 'attack' : 'issue' }); };
        app.executeCustomDigital = function () { openAds({ channel: 'digital' }); };
        app.loadPresetIntoAdComposer = function(presetId) {
            if (!presetId || typeof AdPresets === 'undefined') return;
            var presets = AdPresets.getPresets();
            var p = presets.find(function(x) { return x.id === presetId; });
            if (!p) return;
            var form = el('ov-ad-form');
            if (!form) return;
            if (p.channel && form.channel) form.channel.value = p.channel;
            if (p.type && form.type) form.type.value = p.type;
            if (p.issueId && form.issueId) form.issueId.value = p.issueId;
            if (p.intensity && form.intensity) form.intensity.value = p.intensity;
            if (p.durationWeeks && form.durationWeeks) form.durationWeeks.value = p.durationWeeks;
            if (p.targetId && form.targetId) form.targetId.value = p.targetId;
            readAdForm();
            updateAdPreview();
        };
        app.saveComposerAdPreset = function() {
            var nameInput = el('ov-preset-name-input');
            var name = nameInput ? nameInput.value : '';
            if (!name || !name.trim()) {
                toast("Please enter a name for the preset!");
                return;
            }
            if (typeof AdPresets === 'undefined') return;
            var config = readAdForm();
            var res = AdPresets.savePreset(name, config);
            if (res && res.ok) {
                toast("Preset '" + name + "' saved!");
                if (nameInput) nameInput.value = '';
                var loader = el('ov-preset-loader');
                if (loader) {
                    var all = AdPresets.getPresets();
                    loader.innerHTML = '<option value="">-- Load Saved Preset --</option>' + all.map(function(p) {
                        return '<option value="' + p.id + '">' + p.name + '</option>';
                    }).join('');
                    loader.value = res.preset.id;
                }
            }
        };
        app.openCountyProfile = openCounty;
        if (typeof Counties !== 'undefined' && Counties.selectCounty && !Counties.selectCounty.overhaulUIWrapped) {
            var selectCounty = Counties.selectCounty;
            Counties.selectCounty = function () { var result = selectCounty.apply(this, arguments); addCountyButton(); return result; };
            Counties.selectCounty.overhaulUIWrapped = true;
        }
        addCountyButton();
    }

    document.addEventListener('click', function (event) {
        var target = event.target.closest('[data-ov-action]');
        if (!target) return;
        var action = target.dataset.ovAction;
        if (action === 'close') closeDialog(target.dataset.dialog);
        if (action === 'stance-preview') previewStance(target.dataset.issue, target.dataset.position);
        if (action === 'stance-save') saveStance(target.dataset.issue, target.dataset.position);
        if (action === 'toggle-priority' && typeof app !== 'undefined' && app.toggleCampaignPriority) app.toggleCampaignPriority(target.dataset.issue);
        if (action === 'group-category') { renderGroups(target.dataset.category); var selected = el('ov-groups').querySelector('.ov-tab[aria-pressed="true"]'); if (selected) selected.focus(); }
        if (action === 'group-detail') openGroup(target.dataset.group);
        if (action === 'county-profile') openCounty();
    });
    document.addEventListener('input', function (event) {
        if (event.target.id === 'ov-issue-search') { ui.issueSearch = event.target.value; filterIssues(); }
        if (event.target.id === 'ov-group-search') { ui.groupSearch = event.target.value; filterGroups(); }
        if (event.target.id === 'ov-preference-search') {
            var search = event.target.value.toLowerCase().trim();
            var count = 0;
            el('ov-preference-list').querySelectorAll('.ov-preference').forEach(function (node) { node.hidden = node.dataset.search.indexOf(search) === -1; if (!node.hidden) count++; });
            el('ov-preference-empty').classList.toggle('hidden', count !== 0);
        }
        if (event.target.closest('#ov-ad-form') && event.target.tagName === 'INPUT') updateAdPreview();
    });
    document.addEventListener('change', function (event) {
        if (event.target.id === 'ov-issue-category') { ui.issueCategory = event.target.value; filterIssues(); }
        if (event.target.closest('#ov-ad-form')) updateAdPreview();
    });
    document.addEventListener('submit', function (event) { if (event.target.id === 'ov-ad-form') { event.preventDefault(); buyAd(); } });
    document.addEventListener('error', function (event) {
        var target = event.target;
        if (target.tagName === 'IMG' && target.closest('.ov-portrait')) {
            var fallback = safeURL(target.dataset.fallbackSrc, true);
            if (fallback) { target.dataset.fallbackSrc = ''; target.src = fallback; }
            else target.remove();
        }
    }, true);
    document.addEventListener('keydown', function (event) {
        if (!ui.dialogs.length) return;
        var top = el(ui.dialogs[ui.dialogs.length - 1].id);
        if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); closeDialog(top.id); return; }
        if (event.key !== 'Tab') return;
        var focusable = Array.from(top.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], summary, [tabindex="0"]')).filter(function (node) { return node.getClientRects().length > 0; });
        if (!focusable.length) { event.preventDefault(); top.querySelector('.ov-dialog').focus(); return; }
        var first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || !top.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || !top.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    }, true);
    window.InterestGroupsUI = { renderFinalResultsPanel: renderFinalResultsPanel, renderMovementSummary: movementSummary };
    window.OverhaulUI = { install: wire, refreshCountyButton: addCountyButton, refresh: function () {
        if (el('ov-groups') && !el('ov-groups').classList.contains('hidden')) renderGroups();
        if (el('ov-group-detail') && !el('ov-group-detail').classList.contains('hidden') && ui.groupId) el('ov-group-detail-body').innerHTML = renderGroupDetail(ui.groupId);
        if (el('ov-ads') && !el('ov-ads').classList.contains('hidden')) { readAdForm(); renderAds(); }
    } };
    wire();
    window.addEventListener('load', function () { if (el('ov-ads') && !el('ov-ads').classList.contains('hidden') && adSystemReady()) renderAds(); });
}());
