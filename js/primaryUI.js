/* Primary campaign presentation. Rules and outcomes live in the primary engine. */
(function () {
    'use strict';

    var partyOrder = ['D', 'R', 'L', 'G', 'I', 'PSL'];
    var tabLabels = { map: 'The race', campaign: 'Campaign', calendar: 'Calendar', polls: 'Polling', platform: 'Platform', negotiations: 'Relationships', convention: 'Convention', news: 'News & history' };
    var actionDescriptions = {
        rally: 'A large public event: publicity, enthusiasm, and a stronger local message.',
        townhall: 'Meet voters in a smaller setting. Personal appeal matters in early contests.',
        canvass: 'Use your field operation to contact persuadable voters and identify supporters.',
        office: 'Open a durable field office. Organization carries into the general election.',
        staff: 'Recruit organizers to increase the capacity of your field operation.',
        files: 'Improve voter records, targeting, and the efficiency of future contact.',
        captains: 'Train caucus captains to mobilize attendees and organize the room.',
        gotv: 'Activate your identified supporters close to voting day.',
        fundraise: 'Build small-dollar support and replenish campaign funds.',
        donor: 'Meet donors who back your current message position. Funding includes a four-week commitment to that position.',
        ad: 'Run a television or digital issue campaign. Repeated exposure brings diminishing returns.',
        attack: 'Contrast your record with a rival. Negativity can damage relationships and party unity.',
        debatePrep: 'Prepare for the next primary debate and improve your performance.',
        research: 'Investigate a rival’s vulnerabilities before making a public attack.',
        unity: 'Repair trust with factions and supporters across your party.',
        ballotAccess: 'Build the petition and organizational capacity needed to qualify for the ballot.',
        endorser: 'Court a public figure or organization. Their affinity and existing commitments matter.',
        poll: 'Commission an internal state poll with a larger sample and demographic breakdown.',
        rest: 'Reserve time for recovery and reduce the strain of the campaign.'
    };
    var geography = {
        ME:[12,1], WI:[6,2], VT:[11,2], NH:[12,2], WA:[1,3], ID:[2,3], MT:[3,3], ND:[4,3], MN:[5,3], IL:[6,3], MI:[7,3], NY:[10,3], MA:[11,3],
        OR:[1,4], NV:[2,4], WY:[3,4], SD:[4,4], IA:[5,4], IN:[6,4], OH:[7,4], PA:[8,4], NJ:[9,4], CT:[10,4], RI:[11,4],
        CA:[1,5], UT:[2,5], CO:[3,5], NE:[4,5], MO:[5,5], KY:[6,5], WV:[7,5], VA:[8,5], MD:[9,5], DE:[10,5],
        AZ:[2,6], NM:[3,6], KS:[4,6], AR:[5,6], TN:[6,6], NC:[7,6], SC:[8,6], DC:[9,6],
        OK:[4,7], LA:[5,7], MS:[6,7], AL:[7,7], GA:[8,7], AK:[1,8], HI:[2,8], TX:[4,8], FL:[9,8]
    };
    function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
    function color(value) { return /^(#[a-f\d]{3,8}|hsl\([\d.,%\s]+\)|rgb\([\d.,%\s]+\))$/i.test(String(value)) ? value : '#b8c5d4'; }
    function portrait(candidate, className) { return '<img class="' + esc(className || 'primary-avatar') + '" src="' + esc(candidate && /^images\/[\w .\-/]+$/i.test(candidate.img || '') ? candidate.img : 'images/scenario.jpg') + '" alt="' + esc(candidate && candidate.name) + '" loading="lazy">'; }
    function party(code) { return PARTIES[code] || {name: code || 'Campaign', shortName: code || '', color:'#b8c5d4'}; }
    function candidate(id) { return CANDIDATES.find(function(c) { return String(c.id) === String(id); }); }
    function state() { return typeof PrimaryCampaign !== 'undefined' ? PrimaryCampaign.state() : null; }
    function player() { return typeof PrimaryCampaign !== 'undefined' ? PrimaryCampaign.player() : null; }
    function actorName(id) { var s = state(), a = s && s.actors[id]; return a ? a.candidate.name : (id === 'NOTA' ? 'None of the above' : id==='UNCOMMITTED'?'Uncommitted':id || 'Uncommitted'); }
    function number(value, digits) { return (Number(value) || 0).toLocaleString(undefined, {maximumFractionDigits:digits || 0}); }
    function money(value) { return '$' + number(value, 2) + 'M'; }
    function percent(value) { var n = Number(value) || 0; return number(Math.abs(n) <= 1 ? n * 100 : n, 1) + '%'; }
    function share(value) { return number(value, 1) + '%'; }
    function date(value, short) { var d = new Date(String(value || '').slice(0,10) + 'T12:00:00'); return isNaN(d.getTime()) ? 'Date pending' : d.toLocaleDateString('en-US', short ? {month:'short',day:'numeric'} : {month:'long',day:'numeric',year:'numeric'}); }
    function button(label, action, value, extra) { var classes='primary-btn';extra=(extra||'').replace(/\sclass="([^"]*)"/g,function(_,more){classes+=' '+more;return '';});return '<button type="button" class="'+esc(classes)+'" data-primary-action="' + esc(action) + '"' + (value == null ? '' : ' data-value="' + esc(value) + '"') + extra + '>' + label + '</button>'; }
    function empty(text) { return '<p class="primary-empty">' + esc(text) + '</p>'; }
    function badge(text, cls) { return '<span class="primary-badge ' + esc(cls || '') + '">' + esc(text) + '</span>'; }
    function field(label, id, content, note) { return '<label class="primary-field" for="' + esc(id) + '"><span>' + esc(label) + '</span>' + content + (note ? '<small>' + esc(note) + '</small>' : '') + '</label>'; }
    function options(items, selected) { return items.map(function(item) { return '<option value="' + esc(item.id) + '"' + (String(item.id) === String(selected) ? ' selected' : '') + '>' + esc(item.name || item.label || item.id) + '</option>'; }).join(''); }
    function issues() { return typeof CORE_ISSUES !== 'undefined' ? CORE_ISSUES : []; }
    function issueName(id) { var i = issues().find(function(x) { return x.id === id; }); return i ? i.name : id || 'General message'; }
    function jurisdiction(code) { return typeof PrimaryRules !== 'undefined' && PrimaryRules.jurisdictions[code] || {name:code}; }
    function read(id) { var el = document.getElementById(id); return el ? el.value : ''; }
    function checked(id) { var el = document.getElementById(id); return !!(el && el.checked); }
    function rows(partyCode, area) { return PrimaryCampaign.getPoll(partyCode, area || null) || []; }
    function contests(partyCode) { return PrimaryCampaign.getContests(partyCode) || []; }
    function contestFor(code) { var all = contests(UI.race).filter(function(c) { return c.state === code; }); return all.find(function(c) { return c.status !== 'complete'; }) || all[all.length - 1]; }
    function majorityInfo(partyCode) {
        var p = state().parties[partyCode], total = contests(partyCode).reduce(function(sum,c) { return sum + (Number(c.delegates) || 0); },0);
        return {total:p.totalDelegates || total, majority:p.majority || Math.floor(total / 2) + 1, automatic:Array.isArray(p.automatic) ? p.automatic.reduce(function(n,b){return n+(Number(b.count)||0);},0) : Number(p.automatic) || 0};
    }
    function progress(value, total, tint) { return '<div class="primary-progress" role="img" aria-label="' + esc(number(value) + ' of ' + number(total)) + '"><span style="width:' + Math.max(0, Math.min(100,(Number(value)||0)/(Number(total)||1)*100)) + '%;background:' + color(tint) + '"></span></div>'; }
    function section(title, subtitle, body, cls) { return '<section class="primary-panel primary-section ' + (cls || '') + '"><div class="primary-panel-heading primary-section-header"><h2>' + esc(title) + '</h2>' + (subtitle ? '<p>' + esc(subtitle) + '</p>' : '') + '</div>' + body + '</section>'; }

    var UI = window.PrimaryUI = {
        mode: 'general', tab:'map', race:null, selectedState:null, busy:false, setup:null,
        actionType:'rally', actionIssue:'economy', calendarFilter:'all', endorserFilter:'National', noticeTimer:null,
        showMode: function () { UI.renderMode(); Screens.goTo('campaign-mode-screen'); },
        show: function () { return PrimaryNative.showCampaign(); },
        refresh: function () { UI.render(); },
        notice: function (text, isError) {
            var node = document.getElementById('primary-notice');
            if (!node) return;
            node.textContent = text; node.classList.toggle('primary-toast-error', !!isError); node.hidden = false;
            clearTimeout(UI.noticeTimer); UI.noticeTimer = setTimeout(function () { node.hidden = true; }, 6500);
        },
        perform: async function (fn, message) {
            if (UI.busy) return;
            UI.busy = true;
            try {
                var result = await fn();
                if (result && result.ok === false) { UI.notice(result.error || 'That action is unavailable.', true); return result; }
                if (message) UI.notice(message);
                if (state()) UI.render();
                return result;
            } catch (error) { UI.notice(error && error.message || 'The action could not be completed.', true); }
            finally { UI.busy = false; }
        },
        renderMode: function () {
            var root = document.getElementById('campaign-mode-content');
            if (!root) return;
            root.innerHTML = '<div class="primary-mode-heading"><div class="primary-kicker">YOUR ROAD TO THE WHITE HOUSE</div><h1>Choose your campaign</h1><p>Start with a nomination fight, or take your ticket straight to the national stage.</p></div>' +
                '<div class="primary-mode-grid"><button type="button" class="primary-mode-card primary-mode-primary" data-primary-action="mode" data-value="primary"><div class="primary-mode-art"><img src="images/party-dem.png" alt=""><img src="images/party-rep.png" alt=""></div><div class="primary-mode-copy"><span class="primary-kicker">SEPTEMBER 6, 2027</span><h2>Primary Election</h2><p>Build your organization. Win delegates. Negotiate a coalition. Carry your campaign into November.</p><div class="primary-mode-facts"><span>Multiple contenders</span><span>Party calendars</span><span>Conventions &amp; deals</span></div><strong>BUILD YOUR CAMPAIGN <span aria-hidden="true">→</span></strong></div></button>' +
                '<button type="button" class="primary-mode-card primary-mode-general" data-primary-action="mode" data-value="general"><div class="primary-mode-art"><div class="primary-mode-270">270<span>ELECTORAL VOTES TO WIN</span></div></div><div class="primary-mode-copy"><span class="primary-kicker">JULY 4, 2028</span><h2>General Election</h2><p>Choose your party and presidential ticket, set the field, and begin the existing general election campaign.</p><div class="primary-mode-facts"><span>Choose your running mate</span><span>50 states + D.C.</span><span>Election night</span></div><strong>START THE NATIONAL RACE <span aria-hidden="true">→</span></strong></div></button></div>' +
                '<div class="primary-mode-footer"><div><strong>Continue a campaign</strong><p>Your nomination history and general election travel together.</p></div><div class="primary-button-row">' + button('Resume autosave','resume',null,' id="primary-resume" disabled') + button('Resume manual save','resume-manual') + button('Import save','import') + button('Back to home','home') + '</div></div>' +
                '<p class="primary-source-note">The 2028 nomination calendar is still developing. Each contest identifies confirmed dates, historical rules, and projected scenario assumptions.</p>';
            if (typeof PrimaryStorage !== 'undefined') Promise.resolve(PrimaryStorage.hasSave('autosave')).then(function (exists) { var btn = document.getElementById('primary-resume'); if (btn) btn.disabled = !exists; }).catch(function () {});
        },
        chooseMode: function (mode) {
            if (mode !== 'general' && mode !== 'primary') return;
            UI.mode = mode; gameData.campaignMode = mode;
            var title = document.querySelector('#party-screen .section-title');
            if (title) title.textContent = mode === 'primary' ? 'SELECT YOUR PRIMARY PARTY' : 'SELECT YOUR PARTY';
            Screens.goTo('party-screen');
        },
        beginSetup: function (partyCode) {
            if (!PARTIES[partyCode]) return;
            gameData.selectedParty = partyCode;
            var enabled = partyOrder.filter(function(p) { return p === 'D' || p === 'R' || gameData.thirdPartiesEnabled || p === partyCode; });
            var flow = [{kind:'player',party:partyCode}];
            if (partyCode !== 'I') flow.push({kind:'roster',party:partyCode});
            enabled.filter(function(p) { return p !== partyCode; }).forEach(function(p) { flow.push({kind:'roster',party:p}); });
            flow.push({kind:'summary',party:partyCode});
            UI.setup = {party:partyCode,playerId:null,enabled:enabled,rosters:{},flow:flow,step:0,filter:'all',query:''};
            enabled.forEach(function(p) { UI.setup.rosters[p] = []; });
            UI.renderSetup(); Screens.goTo('primary-setup-screen');
        },
        renderSetup: function () {
            var s = UI.setup; if (!s) return;
            var step = s.flow[s.step], p = party(step.party), root = document.getElementById('primary-setup-content');
            document.getElementById('primary-setup-progress').textContent = 'PRIMARY ELECTION · STEP ' + (s.step + 1) + ' OF ' + s.flow.length;
            root.style.setProperty('--primary-accent',p.color);
            if (step.kind === 'summary') {
                root.innerHTML = '<div class="primary-setup-summary"><div class="primary-kicker">READY FOR THE LONG CAMPAIGN</div><h1>Your 2028 field</h1><p>September 6, 2027 → November 7, 2028. Every enabled party follows its own nomination calendar.</p>' +
                    s.enabled.filter(function(code) { return s.rosters[code] !== null; }).map(function(code) {
                        var ids = (s.rosters[code] || []).slice(); if (code === s.party && ids.indexOf(s.playerId) < 0) ids.unshift(s.playerId);
                        return '<section class="primary-summary-party" style="--primary-accent:' + color(party(code).color) + '"><h2>' + esc(party(code).name) + '</h2><div>' + ids.map(function(id) { var c = candidate(id); return c ? '<span class="primary-summary-contender">' + portrait(c) + '<span>' + esc(c.name) + (id === s.playerId ? '<small>Your campaign</small>' : '') + '</span></span>' : ''; }).join('') + '</div></section>';
                    }).join('') + '<p class="primary-source-note">Your running mate is chosen during nomination and convention negotiations. Independent candidates use a ballot-access campaign; smaller parties follow their own convention or conference routes.</p><div class="primary-button-row">' + button('← Back','setup-back') + button('Begin primary campaign →','setup-start',null,' class="primary-btn primary-btn-accent"') + '</div></div>';
                return;
            }
            var own = step.party === s.party, single = step.kind === 'player' || step.party === 'I';
            var title = step.kind === 'player' ? 'Choose your candidate' : own ? 'Choose your primary opponents' : step.party === 'I' ? 'Choose the independent contender' : 'Choose the ' + p.shortName + ' field';
            var subtitle = step.kind === 'player' ? 'You will lead this campaign from the first organizing push through the nomination.' : step.party === 'I' ? 'Select one independent campaign. It will pursue ballot access alongside the party nomination races.' : own ? 'Select everyone you want to face. Click a highlighted candidate again to remove them. You may also run unopposed.' : 'Select the candidates who will compete in this party’s nomination. Confirm the whole field with Next.';
            var pool = CANDIDATES.filter(function(c) { return c.party === step.party && !(step.kind === 'roster' && own && c.id === s.playerId); });
            var factions = Array.from(new Set(pool.map(function(c) { return c.factionId; }).filter(Boolean)));
            var selected = step.kind === 'player' ? [s.playerId] : (s.rosters[step.party] || []);
            var shown = pool.filter(function(c) { return (s.filter === 'all' || c.factionId === s.filter) && (!s.query || (c.name + ' ' + (c.homeState || '')).toLowerCase().indexOf(s.query.toLowerCase()) >= 0); });
            var valid = step.kind === 'player' ? !!s.playerId : own || selected.length > 0;
            var logos = {D:'dem',R:'rep',G:'grn',L:'lib',I:'ind',PSL:'psl'};
            root.innerHTML = '<div class="party-page-banner primary-setup-banner" style="--party-banner-color:' + color(p.color) + '"><div class="party-banner-left"><img class="party-banner-logo" src="images/party-' + logos[step.party] + '.png" alt="' + esc(p.name) + '"></div><div class="party-banner-right"><div class="primary-kicker">' + esc(p.name) + '</div><h1>' + esc(title) + '</h1><p>' + esc(subtitle) + '</p></div></div>' +
                '<div class="primary-setup-controls">' + field('Find a candidate','primary-setup-search','<input id="primary-setup-search" type="search" value="' + esc(s.query) + '" placeholder="Name or home state">') + field('Faction','primary-setup-faction','<select id="primary-setup-faction">' + options([{id:'all',name:'All factions'}].concat(factions.map(function(id) { return {id:id,name:typeof FACTIONS !== 'undefined' && FACTIONS[id] ? FACTIONS[id].name : id}; })), s.filter) + '</select>') + '<div class="primary-setup-count">' + badge(selected.filter(Boolean).length + (single ? ' selected' : ' opponents selected')) + (!single ? button('Select all','setup-all') + button('Clear','setup-clear') : '') + '</div></div>' +
                '<div class="candidate-tiles-row primary-selection-grid" role="group" aria-label="' + esc(title) + '">' + (shown.length ? shown.map(function(c) { return UI.candidateTile(c, selected.indexOf(c.id) >= 0); }).join('') : empty('No candidates match this filter. Your selected candidates are preserved.')) + '</div>' +
                (step.kind === 'roster' && !own && step.party !== 'D' && step.party !== 'R' ? '<div class="pp-skip-bar">' + button('Remove ' + esc(p.name) + ' from this election','setup-skip') + '</div>' : '') +
                '<div class="party-page-footer primary-setup-footer">' + button('← Back','setup-back') + '<span class="pp-step-indicator">' + esc(step.kind === 'player' ? 'Your presidential campaign' : 'Confirm your selected field') + '</span>' + button('Next →','setup-next',null,valid ? ' class="primary-btn primary-btn-accent"' : ' disabled') + '</div>';
        },
        candidateTile: function (c, selected) {
            var faction = typeof FACTIONS !== 'undefined' && FACTIONS[c.factionId];
            return '<button type="button" class="candidate-tile primary-candidate-tile' + (selected ? ' selected' : '') + '" style="--tile-party-color:' + color(party(c.party).color) + '" data-primary-action="setup-toggle" data-value="' + esc(c.id) + '" aria-pressed="' + !!selected + '"><span class="primary-selection-mark" aria-hidden="true">' + (selected ? '✓' : '+') + '</span>' + portrait(c,'candidate-tile-img') + '<span class="candidate-tile-body"><span class="candidate-tile-meta"><strong class="candidate-tile-name">' + esc(c.name) + '</strong><span class="candidate-tile-position">' + esc(c.position || '') + '</span><span class="primary-candidate-faction">' + esc(faction ? faction.name : c.party) + ' · ' + esc(c.homeState || 'National') + '</span><span class="primary-candidate-stats"><span>Funds <strong>' + money(Math.max(5,(c.funds||40)*(['D','R'].includes(c.party)?0.45:0.25))) + '</strong></span><span>Energy <strong>' + number(c.stamina || 7) + '</strong></span><span>Debate <strong>' + number(c.debateSkill || 5) + '/10</strong></span></span></span><span class="candidate-tile-desc-wrapper"><span class="candidate-tile-desc">' + esc(c.desc || '') + '</span></span></span></button>';
        },
        toggleSetup: function (id) {
            var s=UI.setup, step=s && s.flow[s.step], c=candidate(id); if (!s || !c || c.party !== step.party) return;
            if (step.kind === 'player') {
                s.playerId = s.playerId === c.id ? null : c.id;
                if (s.playerId) s.rosters[s.party] = (s.rosters[s.party] || []).filter(function(x) { return x !== s.playerId; });
            } else if (step.kind === 'roster' && c.id !== s.playerId) {
                var roster = s.rosters[step.party] || [], at = roster.indexOf(c.id);
                s.rosters[step.party] = step.party === 'I' ? (at >= 0 ? [] : [c.id]) : at >= 0 ? roster.filter(function(x) { return x !== c.id; }) : roster.concat([c.id]);
            }
            UI.renderSetup();
        },
        start: async function () {
            var s = UI.setup; if (!s || !s.playerId) return;
            var rosters = {}, enabled = s.enabled.filter(function(p) { return s.rosters[p] !== null; });
            enabled.forEach(function(p) { rosters[p] = (s.rosters[p] || []).slice(); });
            rosters[s.party] = [s.playerId].concat(rosters[s.party].filter(function(id) { return id !== s.playerId; }));
            if (['D','R'].some(function(p) { return !rosters[p] || !rosters[p].length; })) { UI.notice('Choose at least one candidate for each major party.',true); return; }
            UI.notice('Preparing your campaign and county electorates…');
            var result = await UI.perform(function () { return PrimaryCampaign.start({playerId:s.playerId,party:s.party,rosters:rosters,enabledParties:enabled}); });
            if (result && result.ok === false || !state()) return;
              UI.race = s.party; UI.tab = 'map'; UI.selectedState = (PrimaryCampaign.upcoming(s.party,1)[0] || {}).state || 'IA';
              await PrimaryNative.showCampaign();
              if (STATES[UI.selectedState]) Campaign.clickState(UI.selectedState);
        },
        render: function () {
            if (state() && typeof PrimaryNative !== 'undefined') PrimaryNative.renderNominations();
        },
        banner: function () {
            var s=state(), a=player(), p=s.parties[s.playerParty], html='';
            if (UI.race !== s.playerParty) html += '<div class="primary-info-strip">Following the ' + esc(party(UI.race).name) + ' nomination. Campaign actions and agreements still belong to ' + esc(a.candidate.name) + '.</div>';
            if (s.defeat && !s.ended) html += '<div class="primary-decision-banner"><div><h2>' + (s.defeat.winnerId?esc(actorName(s.defeat.winnerId))+' wins your party’s nomination':s.defeat.noNominee?'The convention chose no nominee':'Your campaign is suspended') + '</h2><p>'+(s.defeat.winnerId?'Continue as the nominee using their campaign resources, or end your run here.':s.defeat.noNominee?'Review the convention and end this campaign.':'Advance the calendar to follow your party’s remaining nomination fight, or end your run here.')+'</p></div><div class="primary-button-row">' + (s.defeat.winnerId?button('Continue as nominee','continue-nominee'):'') + button('End my campaign','end-campaign') + '</div></div>';
            if (p.convention && p.convention.pending && !s.ended) html += '<div class="primary-decision-banner"><div><h2>Your convention needs a decision</h2><p>Negotiate, take the next ballot, and finalize the ticket before advancing the calendar.</p></div>' + button('Go to convention','player-convention') + '</div>';
            if (s.ended) html += '<div class="primary-info-strip">This campaign has ended. You can review its results or export your save.</div>';
            return html;
        },
        renderTab: function () {
            switch(UI.tab) {
                case 'campaign': return UI.campaign(); case 'calendar': return UI.calendar(); case 'polls': return UI.polls();
                case 'platform': return UI.platform(); case 'negotiations': return UI.negotiations(); case 'convention': return UI.convention(); case 'news': return UI.news(); default:return UI.overview();
            }
        },
        standings: function (area) {
            var poll=rows(UI.race,area), mi=majorityInfo(UI.race);
            if (!poll.length) return empty('No candidates are registered in this race.');
            return '<div class="primary-standings">' + poll.map(function(r,i) {
                var a=state().actors[r.id], c=r.candidate || a && a.candidate || candidate(r.id), tint=color(r.color || party(UI.race).color);
                return '<article class="primary-standing" style="--contender-color:' + tint + '"><span class="primary-rank">' + (i+1) + '</span>' + portrait(c) + '<div class="primary-standing-main"><strong>' + esc(r.name || c && c.name || r.id) + (r.id===state().playerId?' <span class="primary-you">YOU</span>':'') + '</strong><span>' + esc(r.status || 'active') + ' · ' + money(r.funds) + '</span>' + progress(r.delegates,mi.majority,tint) + '</div><div class="primary-standing-value"><strong>' + share(r.share) + '</strong><span>' + number(r.delegates) + ' delegates</span></div></article>';
            }).join('') + '</div><p class="primary-source-note">Polling shares are among decided voters. Modeled polls have uncertainty; delegates are awarded only when the relevant contest closes.</p>';
        },
        overview: function () {
            var s=state(), p=s.parties[UI.race], mi=majorityInfo(UI.race), all=contests(UI.race), completed=all.filter(function(c) {return c.status==='complete';}), next=PrimaryCampaign.upcoming(UI.race,4);
            var assigned=Object.keys(p.delegates).reduce(function(sum,id){return sum+(Number(p.delegates[id])||0);},0);
            var lead='<div class="primary-page-heading"><div><div class="primary-kicker">' + esc(party(UI.race).name) + '</div><h2>' + (UI.race==='I' ? 'A path onto the ballot' : p.nomineeId ? esc(actorName(p.nomineeId)) + ' leads the ticket' : 'The road to a majority') + '</h2></div>' + badge(p.stage) + '</div><div class="primary-race-metrics"><div><strong>' + number(mi.majority) + '</strong><span>pledged majority target</span></div><div><strong>' + number(assigned) + '<small> / ' + number(mi.total) + '</small></strong><span>delegates allocated</span></div><div><strong>' + number(completed.length) + '<small> / ' + number(all.length) + '</small></strong><span>contests completed</span></div><div><strong>' + number(mi.automatic) + '</strong><span>automatic delegates · convention rules apply</span></div></div>';
            if (UI.race==='I') lead='<div class="primary-page-heading"><div><div class="primary-kicker">INDEPENDENT ROUTE</div><h2>Build a national ballot campaign</h2><p>There is no independent party primary. Organize, qualify, and build support while the other parties nominate.</p></div></div>';
            var tiles=Object.keys(geography).map(function(code) {return UI.stateTile(code,geography[code]);}).join('');
            var territories=Object.keys(PrimaryRules.jurisdictions).filter(function(code) {return !geography[code] && all.some(function(c){return c.state===code;});}).map(function(code){return UI.stateTile(code);}).join('');
            return lead + '<div class="primary-overview-layout"><div>' + section('The nomination map','Select a state to inspect its rules, polling, and delegate pools.','<div class="primary-map-grid primary-map">' + tiles + '</div>' + (territories?'<div class="primary-territories"><span>TERRITORIES &amp; OTHER JURISDICTIONS</span><div>' + territories + '</div></div>':'') + '<div class="primary-map-legend"><span>Open contests show delegates available.</span><span>Completed contests use the leading candidate’s color.</span></div>') + UI.stateDetail() + '</div><aside>' + section('The field','National decided-voter polling',UI.standings()) + section('Coming up','Each party follows its own calendar.',next.length?'<div class="primary-upcoming">' + next.map(function(c){return '<button type="button" data-primary-action="state" data-value="' + esc(c.state) + '"><time>' + esc(date(c.date,true)) + '</time><span><strong>' + esc(c.name || jurisdiction(c.state).name) + '</strong><small>' + esc(c.type) + '</small></span><b>' + number(c.delegates) + '<small>delegates</small></b></button>';}).join('') + '</div>':empty('All scheduled contests have closed. Follow the convention to complete the nomination.')) + '</aside></div>';
        },
        stateTile: function (code, position) {
            var c=contestFor(code), complete=c && c.status==='complete', result=c && c.result, winner=result && Object.keys(result.shares || {}).sort(function(a,b){return result.shares[b]-result.shares[a];})[0], a=winner && state().actors[winner];
            var tint=a && (a.color || a.candidate.color) || (complete ? party(UI.race).color : '#35465a');
            return '<button type="button" class="primary-state-tile' + (UI.selectedState===code?' selected':'') + (complete?' complete':'') + '" style="' + (position?'grid-column:'+position[0]+';grid-row:'+position[1]+';':'') + '--leader-color:' + color(tint) + '" data-primary-action="state" data-value="' + esc(code) + '" aria-pressed="' + (UI.selectedState===code) + '" title="' + esc(jurisdiction(code).name + (c?' · '+date(c.date)+' · '+(complete?'Completed':c.type):'')) + '"><strong>' + esc(code) + '</strong><span>' + (c?number(c.delegates):'—') + '</span>' + (complete?'<i aria-label="Complete">✓</i>':'') + '</button>';
        },
        stateDetail: function () {
            var code=UI.selectedState, c=contestFor(code), s=state(), a=player(), org=a.org[code] || {};
            var head='<div class="primary-state-title"><div><div class="primary-kicker">' + esc(code) + ' · ' + esc(party(UI.race).shortName) + '</div><h2>' + esc(jurisdiction(code).name) + '</h2></div>' + button('Campaign here','campaign-here',code) + '</div>';
            if(!c) return section(jurisdiction(code).name,'No public nomination contest is scheduled for this route.',head + '<p class="primary-muted">Use the campaign panel for organization, ballot access, fundraising, and general outreach.</p>');
            var results=c.result, poolRows=Array.isArray(c.pools)?c.pools:Object.values(c.pools||{});
            var rules='<dl class="primary-rule-list"><div><dt>Voting closes</dt><dd>' + esc(date(c.date)) + '</dd></div><div><dt>Process</dt><dd>' + esc(c.type) + '</dd></div><div><dt>Who participates</dt><dd>' + esc(c.eligibility || 'Party rules apply') + '</dd></div><div><dt>Delegates</dt><dd>' + number(c.delegates) + '</dd></div><div><dt>Input status</dt><dd>' + esc(typeof c.sourceStatus==='object'?Object.values(c.sourceStatus).join(' · '):c.sourceStatus || 'Projected scenario') + '</dd></div></dl>';
            var polls=results?'<div class="primary-table-wrap"><table class="primary-table"><caption>Certified contest result</caption><thead><tr><th>Candidate</th><th>Vote share</th><th>Votes</th><th>Delegates</th></tr></thead><tbody>' + Object.keys(results.shares || {}).sort(function(x,y){return results.shares[y]-results.shares[x];}).map(function(id){return '<tr><th>' + esc(actorName(id)) + '</th><td>' + share(results.shares[id]) + '</td><td>' + number(results.votes && results.votes[id]) + '</td><td>' + number(results.delegates && results.delegates[id]) + '</td></tr>';}).join('') + '</tbody></table></div><p class="primary-source-note">Turnout: ' + number(results.turnout) + '. Completed votes remain fixed; later campaigning affects future contests and the general election.</p>':UI.standings(code);
            var poolTable='<details class="primary-details"><summary>Delegate pools, allocation, and sources</summary><p class="primary-muted">Thresholds apply to each pool separately. District electorates use scenario estimates where precise crosswalks are unavailable.</p><div class="primary-table-wrap"><table class="primary-table"><thead><tr><th>Pool</th><th>Delegates</th><th>Rule</th><th>Threshold</th></tr></thead><tbody>' + poolRows.map(function(pool){return '<tr><th>' + esc(pool.name || pool.id || pool.type) + '</th><td>' + number(pool.delegates == null?pool.count:pool.delegates) + '</td><td>' + esc(pool.method || pool.rule || pool.allocation || 'Proportional') + '</td><td>' + (pool.threshold == null?'Party rule':percent(pool.threshold)) + '</td></tr>';}).join('') + '</tbody></table></div>' + UI.poolResults(results && results.pools) + '<div class="primary-sources">' + (c.sources || []).map(function(source){var url=typeof source==='string'?source:source.url;return /^https?:\/\//.test(url||'')?'<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(source.title || new URL(url).hostname) + ' ↗</a>':'';}).join('') + '</div>' + (c.note?'<p>' + esc(Array.isArray(c.note)?c.note.join(' '):c.note) + '</p>':'') + '</details>';
            return '<section class="primary-panel primary-state-detail">' + head + rules + polls + poolTable + '<div class="primary-org-strip"><span>Your field operation</span><b>' + number(org.offices) + ' offices</b><b>' + number(org.staff) + ' staff</b><b>' + number(org.volunteers) + ' volunteers</b><b>' + number(org.captains) + ' captains</b></div></section>';
        },
        poolResults: function (pools) {
            if(!pools) return '';
            var list=Array.isArray(pools)?pools:Object.keys(pools).map(function(id){return Object.assign({id:id},pools[id]);});
            return '<div class="primary-pool-results">' + list.map(function(p){var allocation=p.delegates || p.allocation || {}, votes=p.shares || {};return '<details><summary>' + esc(p.name || p.id || 'Allocation pool') + '</summary><p>' + Object.keys(allocation).map(function(id){return esc(actorName(id)) + ': ' + number(allocation[id]) + ' delegates' + (votes[id]!=null?' ('+percent(votes[id])+')':'');}).join(' · ') + '</p>' + (p.threshold!=null?'<p>Qualifying threshold: '+percent(p.threshold)+'</p>':'') + '</details>';}).join('') + '</div>';
        },
        calendar: function () {
            var codes=UI.calendarFilter==='all'?Object.keys(state().parties):[UI.race];
            var list=codes.reduce(function(all,p){return all.concat(contests(p));},[]).sort(function(a,b){return a.date.localeCompare(b.date)||a.party.localeCompare(b.party);});
            var filter='<div class="primary-button-row">' + button('All parties','calendar-filter','all',' aria-pressed="' + (UI.calendarFilter==='all') + '"') + button(party(UI.race).shortName+' only','calendar-filter','race',' aria-pressed="' + (UI.calendarFilter==='race') + '"') + '</div>';
            var grouped={}; list.forEach(function(c){var m=c.date.slice(0,7);(grouped[m]||(grouped[m]=[])).push(c);});
            return '<div class="primary-page-heading"><div><div class="primary-kicker">SIMULTANEOUS NOMINATION RACES</div><h2>The 2028 calendar</h2><p>A contest closes in the campaign week containing its date.</p></div>' + filter + '</div>' + Object.keys(grouped).map(function(month){return section(new Date(month+'-01T12:00:00').toLocaleDateString('en-US',{month:'long',year:'numeric'}),'','<div class="primary-table-wrap"><table class="primary-table primary-calendar-table"><thead><tr><th>Date</th><th>Party / jurisdiction</th><th>Contest</th><th>Eligibility</th><th>Delegates</th><th>Status</th></tr></thead><tbody>' + grouped[month].map(function(c){return '<tr class="'+(c.status==='complete'?'primary-row-complete':'')+'"><td>' + esc(date(c.date,true)) + '</td><th><button class="primary-text-button" data-primary-action="contest" data-value="' + esc(c.id) + '"><span style="color:' + color(party(c.party).color) + '">' + esc(party(c.party).shortName) + '</span> · ' + esc(c.name || jurisdiction(c.state).name) + '</button></th><td>' + esc(c.type) + '</td><td>' + esc(c.eligibility) + '</td><td>' + number(c.delegates) + '</td><td>' + badge(c.status==='complete'?'Complete':c.sourceStatus && typeof c.sourceStatus==='string'?c.sourceStatus:'Scheduled') + '</td></tr>';}).join('') + '</tbody></table></div>');}).join('') + '<p class="primary-source-note">Projected dates and rules are playable scenario inputs, not a claim that every party’s 2028 state plan is final. Select any contest to inspect its sources and allocation rules.</p>';
        },
        campaign: function () {
            var s=state(), a=player(), code=UI.selectedState, type=UI.actionType, costs=PrimaryCampaign.actionCosts || {}, price=costs[type] || {}, c=contestFor(code);
            var stateOptions=Object.keys(PrimaryRules.jurisdictions).map(function(id){return {id:id,name:jurisdiction(id).name};}).sort(function(x,y){return x.name.localeCompare(y.name);});
            var rivals=Object.values(s.actors).filter(function(x){return x.party===a.party && x.id!==a.id;});
            var endorserList=typeof ENDORSERS==='undefined'?[]:ENDORSERS.filter(function(e){return e.state==='National' || e.state===code;});
            var actionSelect=field('Campaign action','primary-action-type','<select id="primary-action-type">' + options(Object.keys(actionDescriptions).map(function(id){return {id:id,name:costs[id] && costs[id].label || id.replace(/([A-Z])/g,' $1')};}),type) + '</select>');
            var selectors=field('State or jurisdiction','primary-action-state','<select id="primary-action-state">' + options(stateOptions,code) + '</select>') + actionSelect + field('Message issue','primary-action-issue','<select id="primary-action-issue">' + options(issues(),UI.actionIssue) + '</select>');
            if(['attack','research'].indexOf(type)>=0) selectors+=field('Opponent','primary-action-target','<select id="primary-action-target">' + options(rivals.map(function(r){return {id:r.id,name:r.candidate.name};})) + '</select>');
            if(type==='ad') selectors+=field('Channel','primary-action-channel','<select id="primary-action-channel"><option value="tv">Television</option><option value="digital">Digital</option></select>') + field('Duration','primary-action-duration','<select id="primary-action-duration"><option value="1">1 week</option><option value="2">2 weeks</option><option value="3">3 weeks</option><option value="4">4 weeks</option></select>');
            if(['ad','rally','townhall','canvass'].indexOf(type)>=0) selectors+=field('Audience','primary-action-segment','<select id="primary-action-segment"><option value="all">Broad electorate</option>' + options(typeof INTEREST_GROUPS==='undefined'?[]:Object.keys(INTEREST_GROUPS).map(function(id){return {id:id,name:INTEREST_GROUPS[id].name};})) + '</select>');
            if(type==='endorser') selectors+=field('Endorser','primary-action-endorser','<select id="primary-action-endorser">' + options(endorserList) + '</select>');
            if(type==='ad')selectors+=field('Television market','primary-action-market','<select id="primary-action-market"><option value="">Statewide buy</option>'+options(Object.values(MEDIA_MARKETS).filter(function(m){return m.states.includes(code);}).map(function(m){return {id:m.id,name:m.label};}))+'</select>','TV markets can cross state lines. Market quotes use audience size; digital campaigns use the selected state.');
            if(['rally','townhall','canvass'].includes(type))selectors+=field('County focus','primary-action-county','<select id="primary-action-county"><option value="">Statewide effort</option>'+options(Object.keys(Counties.countyData).filter(function(id){return Counties.countyData[id].s===code;}).map(function(id){return {id:id,name:Counties.countyData[id].n||id};}))+'</select>');
            selectors+=field('Effort','primary-action-intensity','<select id="primary-action-intensity"><option value="1">Standard ×1</option><option value="2">Expanded ×2</option><option value="3">Major push ×3</option></select>','The engine checks funds, energy, prerequisites, travel, and deadlines.');
            if(c && c.pools) { var pools=Array.isArray(c.pools)?c.pools:Object.values(c.pools);selectors+=field('Delegate pool','primary-action-district','<select id="primary-action-district"><option value="">Statewide</option>' + options(pools.filter(function(p){return p.type==='district' || /district|CD/i.test(p.name||p.id||'');}).map(function(p){return {id:p.id,name:p.name||p.id};})) + '</select>','District targeting focuses your local message where threshold margins matter.'); }
            var queue=s.pendingActions || [];
            var queueHtml=queue.length?'<ol class="primary-action-queue">' + queue.map(function(q,i){return '<li><div><strong>' + esc((costs[q.type]||{}).label || q.type) + '</strong><span>' + esc(jurisdiction(q.state).name) + (q.options && q.options.issueId?' · '+esc(issueName(q.options.issueId)):'') + '</span></div>' + button('Cancel','cancel-action',i,' aria-label="Cancel '+esc(q.type)+'"') + '</li>';}).join('') + '</ol>':empty('Your week is open. Queue events, organize, or raise funds, then advance the calendar.');
            var org=a.org[code] || {};
            return '<div class="primary-page-heading"><div><div class="primary-kicker">THE WEEK AHEAD</div><h2>Build your campaign</h2><p>Up to three physical destinations and two of the same action in a state each week.</p></div></div><div class="primary-two-column">' + section('Plan an action',jurisdiction(code).name,'<form id="primary-action-form" class="primary-form"><div class="primary-form-grid">' + selectors + '</div><p class="primary-action-description">' + esc(actionDescriptions[type]) + '</p><div class="primary-action-cost"><span>Base cost <strong>' + money(price.funds) + '</strong></span><span>Energy <strong>' + number(price.energy) + '</strong></span></div><button type="submit" class="primary-btn primary-btn-accent"' + (a.status==='suspended' || s.ended || (s.phase==='general' && !['ballotAccess','unity','endorser'].includes(type))?' disabled':'') + '>Add to this week →</button>' + (s.phase==='general'?'<p class="primary-muted">Ballot access, coalition outreach and endorser meetings remain available here. Schedule other actions from the general election map.</p>':'') + '</form>') + '<div>' + section('This week’s schedule',queue.length+' actions queued',queueHtml) + section('Your operation in '+jurisdiction(code).name,'Organization survives nomination.','<dl class="primary-rule-list"><div><dt>Offices</dt><dd>'+number(org.offices)+'</dd></div><div><dt>Organizers</dt><dd>'+number(org.staff)+'</dd></div><div><dt>Volunteers</dt><dd>'+number(org.volunteers)+'</dd></div><div><dt>Voter file</dt><dd>'+percent(org.file || 0)+'</dd></div><div><dt>Caucus captains</dt><dd>'+number(org.captains)+'</dd></div><div><dt>Contacts</dt><dd>'+number(org.contacts)+'</dd></div></dl>') + '</div></div>' + UI.endorsers();
        },
        endorsers: function () {
            var a=player(), s=state(), code=UI.selectedState, list=typeof ENDORSERS==='undefined'?[]:ENDORSERS.filter(function(e){return e.state==='National' || e.state===code;});
            var endorsements=a.endorsements || [];
            return section('Endorsers & organizations','Court national organizations and local voices in '+jurisdiction(code).name+'.','<div class="primary-endorser-list">' + list.map(function(e){var held=endorsements.some(function(x){return (typeof x==='string'?x:x.id || x.endorserId)===e.id;});var assignment=s.endorserAssignments && s.endorserAssignments[e.id];return '<article><div><strong>'+esc(e.name)+'</strong><span>'+esc(e.type || 'Endorser')+' · '+esc(e.state==='National'?'National':jurisdiction(e.state).name)+'</span>'+(assignment?'<small>Supporting '+esc(actorName(assignment.candidateId || assignment))+'</small>':'')+'</div>'+(held?badge('Endorsed','primary-badge-success'):button('Court','court-endorser',e.id))+'</article>';}).join('')+'</div>');
        },
        polls: function () {
            var s=state(), history=(s.pollHistory || []).filter(function(p){return p.party===UI.race && (!p.state || p.state===UI.selectedState);}).slice(-40).reverse();
            var headers=(s.parties[UI.race].roster || []).map(function(id){return '<th>'+esc(actorName(id))+'</th>';}).join('');
            return '<div class="primary-page-heading"><div><div class="primary-kicker">TRACK THE FIELD</div><h2>Polling & momentum</h2><p>Polls are estimates of the selected electorate, not delegate forecasts.</p></div></div><div class="primary-two-column">'+section('National standing','Decided voters',UI.standings())+section(jurisdiction(UI.selectedState).name,'State electorate',UI.standings(UI.selectedState))+'</div>'+section('Polling history','National releases and the selected state.',history.length?'<div class="primary-table-wrap"><table class="primary-table"><thead><tr><th>Date</th><th>Electorate</th>'+headers+'<th>Undecided</th></tr></thead><tbody>'+history.map(function(h){return '<tr><th>'+esc(date(h.date,true))+'</th><td>'+esc(h.state?jurisdiction(h.state).name:'National')+'</td>'+(s.parties[UI.race].roster || []).map(function(id){return '<td>'+((h.rows||[]).some(function(r){return r.id===id;})?share((h.rows||[]).find(function(r){return r.id===id;}).share):'—')+'</td>';}).join('')+'<td>'+percent(h.undecided || 0)+'</td></tr>';}).join('')+'</tbody></table></div>':empty('Polling history will appear as the campaign progresses.'));
        },
        platform: function () {
            var a=player(), priorities=a.priorities || [], all=issues(), categories=Array.from(new Set(all.map(function(i){return i.category || 'Issues';})));
            var head='<div class="primary-page-heading"><div><div class="primary-kicker">YOUR CAMPAIGN’S CASE</div><h2>Platform & priorities</h2><p>Issue positions shape your coalition. Reversals affect credibility; signed policy commitments can lock positions.</p></div></div><div class="primary-race-metrics"><div><strong>'+percent(a.credibility)+'</strong><span>credibility</span></div><div><strong>'+percent(a.favorability)+'</strong><span>favorability</span></div><div><strong>'+percent(a.unity)+'</strong><span>party unity</span></div><div><strong>'+number(a.momentum,1)+'</strong><span>momentum</span></div></div>';
            return head+section('Your priorities','Choose the issues that receive the most campaign attention.','<form id="primary-priorities-form"><div class="primary-priorities">'+all.map(function(i){return '<label><input type="checkbox" name="priority" value="'+esc(i.id)+'"'+(priorities.indexOf(i.id)>=0?' checked':'')+'><span>'+esc(i.name)+'</span></label>';}).join('')+'</div><button type="submit" class="primary-btn primary-btn-accent">Save priorities</button></form>')+categories.map(function(category){return section(category,'',all.filter(function(i){return (i.category || 'Issues')===category;}).map(function(i){var pos=a.platform[i.id], selected=(IssueModel.positions.find(function(p){return p.id===pos;})||IssueModel.positions[IssueModel.index(pos)]);var detail=(i.positions||[]).find(function(p){return p.id===selected.id;});return '<article class="primary-platform-row"><div><h3>'+esc(i.name)+'</h3><p>'+esc(detail && detail.description || i.description || '')+'</p></div><label class="primary-field" for="primary-position-'+esc(i.id)+'"><span class="primary-sr-only">'+esc(i.name)+' position</span><select id="primary-position-'+esc(i.id)+'" data-primary-position="'+esc(i.id)+'">'+options(IssueModel.positions,selected.id)+'</select></label></article>';}).join(''));}).join('');
        },
        negotiations: function () {
            var s=state(), a=player(), others=Object.values(s.actors).filter(function(x){return x.id!==a.id && x.party===a.party;}), types=[{id:'endorsement',name:'Request an endorsement'},{id:'nonaggression',name:'Non-aggression pact'},{id:'policy',name:'Policy agreement'},{id:'vp',name:'Running-mate agreement'},{id:'cabinet',name:'Cabinet commitment'},{id:'assistance',name:'Campaign assistance'},{id:'convention',name:'Convention cooperation'}];
            var roles=PrimaryNegotiations.cabinetRoles || [];
            roles=Array.isArray(roles)?roles.map(function(r){return typeof r==='string'?{id:r,name:r}:r;}):Object.keys(roles).map(function(id){return {id:id,name:roles[id]};});
            var form='<form id="primary-negotiation-form" class="primary-form"><div class="primary-form-grid">'+field('Negotiate with','primary-deal-target','<select id="primary-deal-target">'+options(others.map(function(x){return {id:x.id,name:x.candidate.name+' · '+party(x.party).shortName};}))+'</select>')+field('Request','primary-deal-type','<select id="primary-deal-type">'+options(types)+'</select>')+field('Offer in return','primary-deal-offer','<select id="primary-deal-offer"><option value="none">No additional concession</option><option value="policy">Policy concession</option><option value="vp">Vice-presidential slot</option><option value="cabinet">Cabinet position</option><option value="assistance">Campaign assistance</option></select>')+field('Cabinet position','primary-deal-role','<select id="primary-deal-role">'+options(roles)+'</select>')+field('Policy issue','primary-deal-issue','<select id="primary-deal-issue">'+options(issues(),UI.actionIssue)+'</select>')+field('Policy position','primary-deal-position','<select id="primary-deal-position">'+options(IssueModel.positions,'center')+'</select>')+field('Duration','primary-deal-duration','<select id="primary-deal-duration"><option value="4">4 weeks</option><option value="8">8 weeks</option><option value="16">16 weeks</option><option value="52">Through the election</option></select>')+'</div><div class="primary-check-row"><label><input id="primary-deal-public" type="checkbox" checked> Public agreement</label><label><input id="primary-deal-withdraw" type="checkbox" checked> Ask rival to withdraw when endorsing</label></div><p class="primary-muted">AI considers trust, opinion, ideology, viability, ambition, and competing commitments. An endorsement influences supporters; it does not transfer bound delegates.</p><button type="submit" class="primary-btn primary-btn-accent"'+(s.ended?' disabled':'')+'>Send proposal →</button></form>';
            var offers=(s.offers || []).filter(function(o){return o.fromId===a.id || o.toId===a.id;}).slice().reverse();
            var offersHtml=offers.length?offers.map(function(o){return '<article class="primary-deal-card"><div class="primary-deal-heading"><strong>'+esc(actorName(o.fromId))+' → '+esc(actorName(o.toId))+'</strong>'+badge(o.status)+'</div><p>'+esc(UI.dealSummary(o))+'</p><p class="primary-muted">'+esc(o.reason || '')+'</p>'+(['countered','proposed'].indexOf(o.status)>=0?'<div class="primary-button-row">'+button(o.status==='countered'?'Accept counteroffer':'Accept','accept-offer',o.id)+button('Decline','reject-offer',o.id)+'</div>':'')+'</article>';}).join(''):empty('No negotiations yet. Open a conversation with a rival or potential ally.');
            var contracts=(s.contracts || []).filter(function(c){return c.fromId===a.id || c.toId===a.id;});
            var contractsHtml=contracts.length?contracts.map(function(c){return '<article class="primary-deal-card"><div class="primary-deal-heading"><strong>'+esc(actorName(c.fromId))+' & '+esc(actorName(c.toId))+'</strong>'+badge(c.status)+'</div><p>'+esc(UI.dealSummary(c))+'</p><small>Signed '+esc(date(c.created,true))+(c.expires?' · expires '+esc(date(c.expires,true)):'')+'</small>'+(c.status==='active'?'<div class="primary-button-row">'+button('Break agreement','break-contract',c.id)+'</div>':'')+'</article>';}).join(''):empty('Accepted agreements appear here with their commitments and expiration.');
            var relationships='<div class="primary-table-wrap"><table class="primary-table"><thead><tr><th>Candidate</th><th>Party</th><th>Status</th><th>Opinion</th><th>Trust</th></tr></thead><tbody>'+others.map(function(x){var r=(x.relationships||{})[a.id] || (a.relationships||{})[x.id] || {};return '<tr><th>'+esc(x.candidate.name)+'</th><td>'+esc(party(x.party).shortName)+'</td><td>'+esc(x.status)+'</td><td>'+number(r.opinion,2)+'</td><td>'+number(r.trust,2)+'</td></tr>';}).join('')+'</tbody></table></div>';
            return '<div class="primary-page-heading"><div><div class="primary-kicker">BUILD A COALITION</div><h2>Relationships & negotiations</h2><p>Make commitments you can keep. Breaking agreements costs trust and credibility.</p></div></div><div class="primary-two-column">'+section('Open negotiations','Policy, positions, endorsements, and strategic cooperation.',form)+section('Conversations','Offers and counteroffers',offersHtml)+'</div>'+section('Signed agreements','Your campaign’s obligations',contractsHtml)+section('The relationship ledger','How other contenders view your campaign.',relationships)+section('Campaign withdrawal','Suspend your campaign and optionally endorse another contender.','<form id="primary-withdraw-form" class="primary-inline-form">'+field('Endorse on withdrawal','primary-withdraw-target','<select id="primary-withdraw-target"><option value="">No endorsement</option>'+options(others.filter(function(x){return x.party===a.party && x.status==='active';}).map(function(x){return {id:x.id,name:x.candidate.name};}))+'</select>')+'<button type="submit" class="primary-btn"'+(a.status!=='active'?' disabled':'')+'>Suspend my campaign</button></form>');
        },
        dealSummary: function (deal) {
            var t=deal.terms || {}, parts=[String(deal.type || 'Agreement').replace(/([A-Z])/g,' $1')];
            if(t.offerType && t.offerType!=='none') parts.push('offer: '+t.offerType);
            if(t.offerType==='cabinet' && t.role) parts.push(t.role+' (prospective nomination after victory)');
            if(t.offerType==='policy' && t.issueId) {var p=IssueModel.positions.find(function(x){return x.id===t.positionId;});parts.push(issueName(t.issueId)+(p?' — '+p.label:''));}
            if(t.duration) parts.push(t.duration+' weeks');
            if(t.withdraw) parts.push('withdrawal requested');
            parts.push(t.public===false?'private':'public'); return parts.join(' · ');
        },
        convention: function () {
            var s=state(), p=s.parties[UI.race], conv=p.convention, own=UI.race===s.playerParty, mi=majorityInfo(UI.race), ballots=conv && conv.ballots || [], latest=ballots[ballots.length-1], nominee=p.nomineeId || conv && conv.winnerId;
            var rules=UI.race==='D'?'Pledged delegates vote under their applicable instructions. Automatic delegates participate under Democratic first-ballot eligibility restrictions; later ballots include eligible automatic delegates.':UI.race==='R'?'Republican delegates follow their state binding and release rules. RNC members are included in the delegation; there is no additional Democratic-style superdelegate bonus.':UI.race==='L'?'Libertarian delegates nominate at convention, using repeated majority ballots and elimination rules. The vice-presidential nomination is a separate decision.':UI.race==='G'?'Green delegates follow state instructions and convention rules, with repeated ballots and elimination where needed.':UI.race==='I'?'Independent candidates do not hold a party nomination convention. Build ballot access and choose the ticket for the general election.':'This party uses a projected conference process to choose and ratify its ticket.';
            var ballotTable=ballots.length?'<div class="primary-table-wrap"><table class="primary-table"><thead><tr><th>Ballot</th><th>Majority</th><th>Votes</th></tr></thead><tbody>'+ballots.map(function(b){return '<tr><th>'+number(b.round)+'</th><td>'+number(b.majority)+'</td><td>'+Object.keys(b.votes || {}).sort(function(a,c){return b.votes[c]-b.votes[a];}).map(function(id){return esc(actorName(id))+': <strong>'+number(b.votes[id],1)+'</strong>';}).join(' · ')+'</td></tr>';}).join('')+'</tbody></table></div>':empty('The convention roll call will appear here when delegates assemble.');
            var body='<p class="primary-convention-rules">'+esc(rules)+'</p><div class="primary-race-metrics"><div><strong>'+number(latest?latest.majority:mi.majority)+'</strong><span>'+(latest?'last ballot majority':'pledged majority target')+'</span></div><div><strong>'+number(mi.automatic)+'</strong><span>automatic delegates</span></div><div><strong>'+number(conv && conv.round || 0)+'</strong><span>ballots held</span></div></div>'+ballotTable+'<div class="primary-button-row">'+(own && conv && !conv.winnerId && !conv.noNominee?button('Take the next ballot','ballot',UI.race,' class="primary-btn primary-btn-accent"'):'')+button('Negotiate an agreement','tab','negotiations')+'</div>';
            var vp='';
            if(nominee) {
                var winner=s.actors[nominee], selected=p.vpId, choices=own?PrimaryConventions.vpChoices(UI.race) || []:[];
                vp=section('The ticket',actorName(nominee)+' is the presidential nominee.','<div class="primary-ticket-result">'+portrait(winner && winner.candidate)+'<div><h3>'+esc(actorName(nominee))+'</h3><p>'+esc(party(UI.race).name)+' presidential nominee</p>'+(selected?'<strong>Running mate: '+esc((candidate(selected) || (typeof VPS!=='undefined' && VPS.find(function(v){return v.id===selected;})) || {}).name || actorName(selected))+'</strong>':'<p>The vice-presidential slot has not been finalized.</p>')+'</div></div>'+(own && nominee===s.playerId && !selected?'<p class="primary-muted">Select a running mate. Existing role commitments and the party’s nomination procedure apply.</p><div class="primary-vp-grid">'+choices.map(function(v){var c=v.candidate || v;return '<button type="button" class="primary-vp-choice" data-primary-action="vp" data-value="'+esc(c.id)+'">'+portrait(c)+'<span><strong>'+esc(c.name)+'</strong><small>'+esc(c.homeState || c.state || c.position || '')+'</small></span></button>';}).join('')+'</div>':'')+(own && nominee===s.playerId?'<div class="primary-button-row">'+button('Continue to general campaign →','general',null,' class="primary-btn primary-btn-accent"')+'</div>':''));
            }
            return '<div class="primary-page-heading"><div><div class="primary-kicker">'+esc(party(UI.race).name)+'</div><h2>Nomination & convention</h2><p>Winning a majority, delegate freedom, and coalition agreements determine the nominee.</p></div>'+badge(p.stage)+'</div>'+section('The roll call',conv?'Convention in progress':'Scheduled '+date(PrimaryRules.conventions[UI.race])+' · '+PrimaryRules.conventionStatus[UI.race],body)+vp+section('Delegate standing','Bound delegates remain subject to their party and state rules.',UI.standings());
        },
        news: function () {
            var s=state(), logs=(s.logs||[]).slice(), a=player(), scandals=(a.scandals || []).filter(function(item){return item.remaining>0;});
            var news=logs.length?'<ol class="primary-news-feed">'+logs.map(function(l){return '<li><time>'+esc(date(l.date,true))+'</time><p>'+esc(l.text || l.message || '')+'</p></li>';}).join('')+'</ol>':empty('Your campaign news will appear here.');
            var scandalHtml=scandals.length?scandals.map(function(item){return '<article class="primary-deal-card"><h3>'+esc(item.label || item.title || item.name || 'Campaign controversy')+'</h3><p>'+esc(item.description || item.text || '')+'</p>'+badge(item.status || 'Active')+'</article>';}).join(''):empty('No active campaign controversies.');
            return '<div class="primary-page-heading"><div><div class="primary-kicker">THE CAMPAIGN RECORD</div><h2>News & history</h2><p>Results, debates, withdrawals, endorsements, negotiations, and your weekly decisions.</p></div><div class="primary-button-row">'+button('Save now','save')+button('Export campaign','export')+button('Import save','import')+'</div></div><div class="primary-two-column"><div>'+section('Campaign dispatches','Latest first',news)+'</div><aside>'+section('Campaign vulnerabilities','Your candidate’s active controversies',scandalHtml)+section('Your campaign archive','Primary and general election data stay together.','<p class="primary-muted">Use autosave to continue on this browser, or export a campaign file to keep a separate copy.</p><div class="primary-button-row">'+button('Resume autosave','resume')+button('Choose a new campaign','mode-page')+'</div><p class="primary-source-note">Rules snapshot: '+esc(PrimaryRules.version)+'. No votes in a completed contest are rewritten by later endorsements.</p>')+'</aside></div>';
        }
    };

    var originalSelectParty=Screens.selectParty;
    Screens.selectParty=function(code) { if(UI.mode==='primary') return UI.beginSetup(code); return originalSelectParty.apply(this,arguments); };

    document.addEventListener('click',function(event) {
        var el=event.target.closest('[data-primary-action]'); if(!el || el.disabled) return;
        var action=el.dataset.primaryAction, value=el.dataset.value, s=UI.setup, step=s && s.flow[s.step];
        switch(action) {
            case 'home': Screens.goTo('intro-screen'); break;
            case 'mode-page': case 'mode-page-back': UI.showMode(); break;
            case 'mode': UI.chooseMode(value); break;
            case 'setup-toggle': UI.toggleSetup(value); break;
            case 'setup-back': if(!s || s.step===0) Screens.goTo('party-screen'); else {s.step--;s.filter='all';s.query='';UI.renderSetup();} break;
            case 'setup-next': if(!s)return; if(step.kind==='player'&&!s.playerId)return; if(step.kind==='roster'&&step.party!==s.party&&!(s.rosters[step.party]||[]).length){UI.notice('Select at least one contender or remove this party.',true);return;} s.step++;s.filter='all';s.query='';UI.renderSetup();break;
            case 'setup-all': if(step && step.kind==='roster' && step.party!=='I'){s.rosters[step.party]=CANDIDATES.filter(function(c){return c.party===step.party&&c.id!==s.playerId;}).map(function(c){return c.id;});UI.renderSetup();}break;
            case 'setup-clear': if(step && step.kind==='roster'){s.rosters[step.party]=[];UI.renderSetup();}break;
            case 'setup-skip': if(step && step.kind==='roster'&&step.party!==s.party&&step.party!=='D'&&step.party!=='R'){s.rosters[step.party]=null;s.step++;s.filter='all';s.query='';UI.renderSetup();}break;
            case 'setup-start': UI.start();break;
            case 'tab': if(tabLabels[value]){UI.tab=value;UI.render();}break;
            case 'race': if(state().parties[value]){UI.race=value;UI.render();}break;
            case 'state': if(PrimaryRules.jurisdictions[value]){UI.selectedState=value;UI.render();}break;
            case 'campaign-here': if(PrimaryRules.jurisdictions[value]){UI.selectedState=value;UI.tab='campaign';UI.render();}break;
            case 'calendar-filter': UI.calendarFilter=value==='all'?'all':'race';UI.render();break;
            case 'contest': var contest=state().contests.find(function(c){return c.id===value;});if(contest){UI.race=contest.party;UI.selectedState=contest.state;UI.tab='map';UI.render();}break;
            case 'advance': case 'advance-quiet': UI.perform(function(){return Campaign.nextWeek();});break;
            case 'general': UI.perform(function(){return PrimaryCampaign.enterGeneral();});break;
            case 'save': UI.perform(function(){return PrimaryStorage.save('autosave');},'Campaign saved.');break;
            case 'export': UI.perform(function(){return PrimaryStorage.exportSave();});break;
            case 'import': document.getElementById('primary-save-import').click();break;
            case 'resume-manual': UI.perform(function(){return PrimaryStorage.load('manual');},'Campaign restored.');break;
            case 'resume': UI.perform(function(){return PrimaryStorage.load('autosave');},'Campaign restored.');break;
            case 'cancel-action': if(/^\d+$/.test(value))UI.perform(function(){return PrimaryCampaign.cancelAction(Number(value));});break;
            case 'court-endorser': if(typeof ENDORSERS!=='undefined'&&ENDORSERS.some(function(e){return e.id===value;}))UI.perform(function(){return PrimaryCampaign.queueAction('endorser',UI.selectedState,{endorserId:value,intensity:1,issueId:UI.actionIssue});},'Endorser meeting added to this week.');break;
            case 'accept-offer': UI.perform(function(){return PrimaryNegotiations.accept(value);});break;
            case 'reject-offer': UI.perform(function(){return PrimaryNegotiations.reject(value);});break;
            case 'break-contract': UI.perform(function(){return PrimaryNegotiations.breakContract(value);});break;
            case 'ballot': if(value===state().playerParty)UI.perform(function(){return PrimaryConventions.ballot(value);});break;
            case 'vp': UI.perform(function(){return PrimaryConventions.selectVP(state().playerParty,value);});break;
            case 'player-convention': UI.race=state().playerParty;UI.tab='convention';UI.render();break;
            case 'continue-nominee': UI.perform(function(){return PrimaryCampaign.continueAsNominee();});break;
            case 'end-campaign': UI.perform(function(){return PrimaryCampaign.endCampaign();});break;
        }
    });
    document.addEventListener('change',function(event) {
        var el=event.target;
        if(el.id==='primary-setup-faction' && UI.setup){UI.setup.filter=el.value;UI.renderSetup();}
        else if(el.id==='primary-action-type' && actionDescriptions[el.value]){UI.actionType=el.value;UI.render();}
        else if(el.id==='primary-action-state' && PrimaryRules.jurisdictions[el.value]){UI.selectedState=el.value;UI.render();}
        else if(el.id==='primary-action-issue')UI.actionIssue=el.value;
        else if(el.dataset.primaryPosition)UI.perform(function(){return PrimaryCampaign.setPlatform(el.dataset.primaryPosition,el.value);});
        else if(el.id==='primary-save-import'&&el.files[0]){var file=el.files[0];UI.perform(function(){return PrimaryStorage.importFile(file);},'Campaign imported.');el.value='';}
    });
    document.addEventListener('input',function(event) {
        if(event.target.id!=='primary-setup-search' || !UI.setup)return;
        var pos=event.target.selectionStart; UI.setup.query=event.target.value;UI.renderSetup();var input=document.getElementById('primary-setup-search');input.focus();if(input.setSelectionRange)input.setSelectionRange(pos,pos);
    });
    document.addEventListener('submit',function(event) {
        var id=event.target.id;
        if(['primary-action-form','primary-negotiation-form','primary-priorities-form','primary-withdraw-form'].indexOf(id)<0)return;
        event.preventDefault();
        if(id==='primary-action-form'){
            var type=read('primary-action-type'), place=read('primary-action-state'), o={issueId:read('primary-action-issue'),targetId:read('primary-action-target'),segment:read('primary-action-segment')||'all',channel:read('primary-action-channel')||'tv',intensity:Number(read('primary-action-intensity'))||1,duration:Number(read('primary-action-duration'))||1,district:read('primary-action-district'),endorserId:read('primary-action-endorser')};
            o.marketId=read('primary-action-market')||null;o.countyId=read('primary-action-county')||null;
            UI.perform(function(){return PrimaryCampaign.queueAction(type,place,o);},'Action added to this week.');
        }else if(id==='primary-negotiation-form'){
            var target=read('primary-deal-target'), terms={type:read('primary-deal-type'),offerType:read('primary-deal-offer'),issueId:read('primary-deal-issue'),positionId:read('primary-deal-position'),role:read('primary-deal-role'),duration:Number(read('primary-deal-duration')),public:checked('primary-deal-public'),withdraw:checked('primary-deal-withdraw')};
            UI.perform(function(){return PrimaryNegotiations.propose(state().playerId,target,terms);});
        }else if(id==='primary-priorities-form'){
            var priorities=Array.from(event.target.querySelectorAll('input[name="priority"]:checked')).map(function(el){return el.value;});
            UI.perform(function(){return PrimaryCampaign.setPriorities(priorities);},'Campaign priorities updated.');
        }else if(id==='primary-withdraw-form'){
            var endorsee=read('primary-withdraw-target')||null;
            UI.perform(function(){return PrimaryCampaign.withdraw(state().playerId,endorsee);});
        }
    });
    document.addEventListener('error',function(event){var img=event.target;if(img.tagName==='IMG'&&img.closest('.primary-shell')&&!img.src.endsWith('/images/scenario.jpg'))img.src='images/scenario.jpg';},true);
    UI.renderMode();
})();

/* Contextual guidance uses the same results and allocation functions as play. */
(function () {
    'use strict';
    var ui=PrimaryUI;
    function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
    function name(id){var a=PrimaryCampaign.actor(id);return a?a.candidate.name:id==='UNCOMMITTED'?'Uncommitted':id;}
    function panel(title,body){return '<section class="primary-panel primary-section"><div class="primary-section-header"><h2>'+esc(title)+'</h2></div>'+body+'</section>';}
    var overview=ui.overview;
    ui.overview=function(){var html=overview.apply(ui,arguments),p=PrimaryCampaign.state(),a=PrimaryCampaign.player(),ps=p.parties[p.playerParty];
        if(ui.race!==p.playerParty)return html;
        if(a.party==='I'){var access=Object.keys(STATES).filter(function(c){return a.ballotAccess[c]>=100;}),ev=access.reduce(function(n,c){return n+STATES[c].ev;},0);return panel('Ballot-access progress','<p class="primary-muted">Qualified in '+access.length+' jurisdictions with '+ev+' electoral votes available. This scenario closes petition organizing on September 5, 2028.</p><p class="primary-source-note">Jurisdictions still needing work: '+esc(Object.keys(STATES).filter(function(c){return a.ballotAccess[c]<100;}).join(', '))+'</p>')+html;}
        var remaining=PrimaryCampaign.getContests(a.party).filter(function(c){return c.status==='scheduled';}).reduce(function(n,c){return n+c.delegates;},0),needed=Math.max(0,ps.majority-(ps.delegates[a.id]||0));
        var rows=PrimaryCampaign.upcoming(a.party,12).filter(function(c){return c.delegates;}).map(function(c){var poll=PrimaryCampaign.getPoll(a.party,c.state),weights={};poll.forEach(function(r){if(r.share>0)weights[r.id]=r.share;});var projected=0;
            c.pools.forEach(function(pool){projected+=PrimaryRules.allocate(weights,pool,a.party,Object.keys(weights)).delegates[a.id]||0;});
            var share=(poll.find(function(r){return r.id===a.id;})||{}).share||0,threshold=Math.max.apply(null,c.pools.map(function(pool){return pool.threshold||0;}))*100;
            return {c:c,projected:projected,share:share,threshold:threshold};
        }).sort(function(x,y){return y.projected-x.projected;}).slice(0,6);
        return panel('Your delegate path','<p class="primary-muted">'+(needed===0?'You have a pledged majority. Ratify the nomination, settle the ticket, and prepare for November.':needed>remaining?'A pledged majority is no longer mathematically available from remaining contests alone. Your path runs through the convention.':'You need '+needed+' of the '+remaining+' remaining delegates ('+(remaining?needed/remaining*100:0).toFixed(1)+'%).')+'</p><div class="primary-table-wrap"><table class="primary-table"><thead><tr><th>Upcoming opportunity</th><th>Polling</th><th>Projected delegates</th><th>Threshold risk</th></tr></thead><tbody>'+rows.map(function(r){return '<tr><th><button class="primary-text-button" data-primary-action="campaign-here" data-value="'+esc(r.c.state)+'">'+esc(r.c.name)+'</button></th><td>'+r.share.toFixed(1)+'%</td><td>'+r.projected+' / '+r.c.delegates+'</td><td>'+(!r.threshold?'No threshold':Math.abs(r.share-r.threshold)<4?'Within polling error of '+r.threshold.toFixed(0)+'%':r.share<r.threshold?'Below '+r.threshold.toFixed(0)+'%':'Above '+r.threshold.toFixed(0)+'%')+'</td></tr>';}).join('')+'</tbody></table></div><p class="primary-source-note">Projections apply today’s statewide poll to each delegate pool. Actual district results, early ballots, caucus attendance, and uncertainty can change the allocation.</p>')+html;
    };
    var detail=ui.stateDetail;
    ui.stateDetail=function(){var html=detail.apply(ui,arguments),p=PrimaryCampaign.state(),c=PrimaryCampaign.getContests(ui.race).find(function(c){return c.state===ui.selectedState&&c.delegates;});if(!c)return html;
        var status='<p class="primary-muted">Early voting '+(c.earlyShare?'begins '+esc(c.earlyStart)+'; '+(c.earlyWeight*100).toFixed(1)+'% of the modeled electorate has already voted.':'is not separately modeled for this process.')+' Delegate selection: '+esc(c.selectionDate)+'.</p>';
        if(c.allowUncommitted)status+='<p class="primary-muted">An uncommitted protest preference is available in this scenario. Any delegates it earns are tracked separately from candidate totals.</p>';
        if(c.result&&c.realignment)status+='<p class="primary-muted">'+esc(c.result.caucusGeography)+'. '+c.result.caucusRounds.length+' local assemblies realigned before delegate allocation.</p>';
        if(c.selectedDelegates)status+='<p class="primary-muted">Selected delegate ledger: '+Object.keys(c.selectedDelegates).map(function(id){return esc(name(id))+': '+c.selectedDelegates[id];}).join(' · ')+'.</p>';
        if(c.provenance)status+='<details class="primary-details"><summary>Scenario provenance</summary><dl class="primary-rule-list">'+Object.keys(c.provenance).map(function(k){return '<div><dt>'+esc(k)+'</dt><dd>'+esc(c.provenance[k])+'</dd></div>';}).join('')+'</dl></details>';
        return html+panel('Voting and delegate selection',status);
    };
    var polling=ui.polls;
    ui.polls=function(){var html=polling.apply(ui,arguments),s=PrimaryCampaign.state(),internal=s.pollHistory.filter(function(h){return h.internal&&h.party===ui.race&&h.state===ui.selectedState;}).slice(-1)[0];if(!internal||!internal.groups)return html;
        var groups=internal.groups,ids=s.parties[ui.race].roster;
        return html+panel('Internal poll: demographic estimates','<p class="primary-source-note">Commissioned '+esc(internal.date)+' · '+internal.sample+' modeled interviews · approximately ±'+internal.marginOfError+' points overall. Smaller subgroups have greater uncertainty; demographic preferences are scenario estimates.</p><div class="primary-table-wrap"><table class="primary-table"><thead><tr><th>Electorate group</th>'+ids.map(function(id){return '<th>'+esc(name(id))+'</th>';}).join('')+'</tr></thead><tbody>'+Object.keys(groups).map(function(id){var group=groups[id],total=Object.values(group.votes).reduce(function(a,b){return a+b;},0);return '<tr><th>'+esc(INTEREST_GROUPS[id]&&INTEREST_GROUPS[id].name||id)+'</th>'+ids.map(function(candidate){return '<td>'+(total?(group.votes[candidate]||0)/total*100:0).toFixed(1)+'%</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>');
    };
    var calendar=ui.calendar;
    ui.calendar=function(){var s=PrimaryCampaign.state();return panel('Conventions and ticket deadlines','<div class="primary-table-wrap"><table class="primary-table"><thead><tr><th>Party</th><th>Convention / checkpoint</th><th>Schedule status</th><th>Nomination</th></tr></thead><tbody>'+Object.keys(s.parties).map(function(party){return '<tr><th>'+esc(PARTIES[party].name)+'</th><td>'+esc(PrimaryRules.conventions[party])+'</td><td>'+esc(PrimaryRules.conventionStatus[party])+'</td><td>'+esc(s.parties[party].stage)+'</td></tr>';}).join('')+'</tbody></table></div>')+calendar.apply(ui,arguments);};
    var news=ui.news;
    ui.news=function(){var html=news.apply(ui,arguments),p=PrimaryCampaign.state(),a=PrimaryCampaign.player(),completed=PrimaryCampaign.getContests(a.party).filter(function(c){return c.result;}),votes=completed.reduce(function(n,c){return n+(c.result.votes[a.id]||0);},0),wins=completed.filter(function(c){return Object.keys(c.result.votes).sort(function(x,y){return c.result.votes[y]-c.result.votes[x];})[0]===a.id;}).length;
        return panel('Your campaign in numbers','<div class="primary-race-metrics"><div><strong>'+votes.toLocaleString()+'</strong><span>nomination votes</span></div><div><strong>'+wins+'</strong><span>contests led</span></div><div><strong>$'+a.raised.toFixed(1)+'M</strong><span>raised during the primary</span></div><div><strong>'+a.record.length+'</strong><span>primary campaign actions</span></div></div><p class="primary-source-note">'+(p.handoffDate?'The general campaign began on '+esc(p.handoffDate)+'. ':'')+'The exported archive includes all party results, convention ballots, commitments, and the campaign record.</p>')+html;
    };
}());
