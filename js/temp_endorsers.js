const endorserDB = {
  national: [
    { id: 'n_obama', name: 'Barack Obama', type: 'individual', baseLean: { D: 100, R: -100, G: 15, L: -40 }, threshold: 80, ralliesGranted: 5 },
    { id: 'n_biden', name: 'Joe Biden', type: 'individual', baseLean: { D: 75, R: -100, G: -10, L: -50 }, threshold: 65, ralliesGranted: 1 },
    { id: 'n_clinton_bill', name: 'Bill Clinton', type: 'individual', baseLean: { D: 70, R: -75, G: -20, L: -30 }, threshold: 65, ralliesGranted: 2 },
    { id: 'n_clinton_hillary', name: 'Hillary Clinton', type: 'individual', baseLean: { D: 80, R: -100, G: -5, L: -50 }, threshold: 70, ralliesGranted: 2 },
    { id: 'n_trump', name: 'Donald Trump', type: 'individual', baseLean: { D: -100, R: 100, G: -60, L: -20 }, threshold: 85, ralliesGranted: 5 },
    { id: 'n_vance', name: 'J.D. Vance', type: 'individual', baseLean: { D: -95, R: 92, G: -50, L: -10 }, threshold: 85, ralliesGranted: 4 },
    { id: 'n_harris', name: 'Kamala Harris', type: 'individual', baseLean: { D: 85, R: -100, G: 10, L: -55 }, threshold: 75, ralliesGranted: 3 },
    { id: 'n_pence', name: 'Mike Pence', type: 'individual', baseLean: { D: -65, R: 55, G: -35, L: -20 }, threshold: 70, ralliesGranted: 2 },
    { id: 'n_sanders', name: 'Bernie Sanders', type: 'individual', baseLean: { D: 55, R: -100, G: 75, L: -25 }, threshold: 75, ralliesGranted: 4 },
    { id: 'n_warren', name: 'Elizabeth Warren', type: 'individual', baseLean: { D: 75, R: -100, G: 50, L: -35 }, threshold: 78, ralliesGranted: 3 },
    { id: 'n_aoc', name: 'Alexandria Ocasio-Cortez', type: 'individual', baseLean: { D: 72, R: -100, G: 70, L: -45 }, threshold: 75, ralliesGranted: 4 },
    { id: 'n_schumer', name: 'Chuck Schumer', type: 'individual', baseLean: { D: 88, R: -90, G: 5, L: -60 }, threshold: 68, ralliesGranted: 2 },
    { id: 'n_pelosi', name: 'Nancy Pelosi', type: 'individual', baseLean: { D: 88, R: -100, G: 10, L: -65 }, threshold: 72, ralliesGranted: 2 },
    { id: 'n_mcconnell', name: 'Mitch McConnell', type: 'individual', baseLean: { D: -100, R: 75, G: -60, L: -40 }, threshold: 82, ralliesGranted: 1 },
    { id: 'n_cruz', name: 'Ted Cruz', type: 'individual', baseLean: { D: -100, R: 90, G: -55, L: 10 }, threshold: 80, ralliesGranted: 3 },
    { id: 'n_rubio', name: 'Marco Rubio', type: 'individual', baseLean: { D: -80, R: 85, G: -40, L: -15 }, threshold: 75, ralliesGranted: 3 },
    { id: 'n_romney', name: 'Mitt Romney', type: 'individual', baseLean: { D: -15, R: 52, G: -20, L: 12 }, threshold: 65, ralliesGranted: 2 },
    { id: 'n_cheney_liz', name: 'Liz Cheney', type: 'individual', baseLean: { D: 25, R: 30, G: -15, L: 18 }, threshold: 80, ralliesGranted: 2 },
    { id: 'n_haley', name: 'Nikki Haley', type: 'individual', baseLean: { D: -45, R: 70, G: -30, L: -5 }, threshold: 82, ralliesGranted: 3 },
    { id: 'n_desantis', name: 'Ron DeSantis', type: 'individual', baseLean: { D: -92, R: 82, G: -55, L: -20 }, threshold: 80, ralliesGranted: 3 },
    { id: 'n_buttigieg', name: 'Pete Buttigieg', type: 'individual', baseLean: { D: 78, R: -75, G: 18, L: 12 }, threshold: 72, ralliesGranted: 3 },
    { id: 'n_booker', name: 'Cory Booker', type: 'individual', baseLean: { D: 85, R: -82, G: 22, L: -35 }, threshold: 70, ralliesGranted: 3 },
    { id: 'n_klobuchar', name: 'Amy Klobuchar', type: 'individual', baseLean: { D: 78, R: -60, G: 8, L: -15 }, threshold: 68, ralliesGranted: 2 },
    { id: 'n_walz', name: 'Tim Walz', type: 'individual', baseLean: { D: 85, R: -78, G: 15, L: -28 }, threshold: 72, ralliesGranted: 4 },
    { id: 'n_swift', name: 'Taylor Swift', type: 'individual', baseLean: { D: 65, R: -42, G: 22, L: 5 }, threshold: 88, ralliesGranted: 5 },
    { id: 'n_oprah', name: 'Oprah Winfrey', type: 'individual', baseLean: { D: 80, R: -40, G: 15, L: -10 }, threshold: 82, ralliesGranted: 4 },
    { id: 'n_musk', name: 'Elon Musk', type: 'individual', baseLean: { D: -70, R: 80, G: -35, L: 55 }, threshold: 85, ralliesGranted: 3 },
    { id: 'n_rogan', name: 'Joe Rogan', type: 'individual', baseLean: { D: 8, R: 35, G: 5, L: 58 }, threshold: 75, ralliesGranted: 3 },
    { id: 'n_rock', name: 'Dwayne "The Rock" Johnson', type: 'individual', baseLean: { D: 22, R: 22, G: 5, L: 12 }, threshold: 80, ralliesGranted: 4 },
    { id: 'n_lebron', name: 'LeBron James', type: 'individual', baseLean: { D: 72, R: -52, G: 15, L: -8 }, threshold: 80, ralliesGranted: 3 },
    { id: 'n_beyonce', name: 'Beyoncé', type: 'individual', baseLean: { D: 68, R: -52, G: 22, L: -5 }, threshold: 90, ralliesGranted: 4 },
    { id: 'n_mcconaughey', name: 'Matthew McConaughey', type: 'individual', baseLean: { D: 18, R: 18, G: 8, L: 15 }, threshold: 75, ralliesGranted: 3 },
    { id: 'n_kid_rock', name: 'Kid Rock', type: 'individual', baseLean: { D: -80, R: 78, G: -50, L: 15 }, threshold: 68, ralliesGranted: 2 },
    { id: 'n_aflcio', name: 'AFL-CIO', type: 'organization', baseLean: { D: 82, R: -60, G: 20, L: -28 }, threshold: 70, ralliesGranted: 0 },
    { id: 'n_uaw', name: 'United Auto Workers (UAW)', type: 'organization', baseLean: { D: 62, R: -30, G: 10, L: -18 }, threshold: 70, ralliesGranted: 0 },
    { id: 'n_teamsters', name: 'International Brotherhood of Teamsters', type: 'organization', baseLean: { D: 18, R: 22, G: -5, L: 8 }, threshold: 65, ralliesGranted: 0 },
    { id: 'n_seiu', name: 'SEIU', type: 'organization', baseLean: { D: 90, R: -80, G: 28, L: -38 }, threshold: 70, ralliesGranted: 0 },
    { id: 'n_nea', name: 'National Education Association (NEA)', type: 'organization', baseLean: { D: 82, R: -72, G: 28, L: -32 }, threshold: 68, ralliesGranted: 0 },
    { id: 'n_ufcw', name: 'United Food & Commercial Workers', type: 'organization', baseLean: { D: 72, R: -42, G: 14, L: -18 }, threshold: 68, ralliesGranted: 0 },
    { id: 'n_usw', name: 'United Steelworkers (USW)', type: 'organization', baseLean: { D: 60, R: -20, G: 8, L: -12 }, threshold: 65, ralliesGranted: 0 },
    { id: 'n_ibew', name: 'International Brotherhood of Electrical Workers', type: 'organization', baseLean: { D: 55, R: -18, G: 12, L: -10 }, threshold: 65, ralliesGranted: 0 },
    { id: 'n_nra', name: 'National Rifle Association (NRA)', type: 'organization', baseLean: { D: -92, R: 90, G: -62, L: 42 }, threshold: 75, ralliesGranted: 0 },
    { id: 'n_goa', name: 'Gun Owners of America (GOA)', type: 'organization', baseLean: { D: -100, R: 72, G: -72, L: 72 }, threshold: 80, ralliesGranted: 0 },
    { id: 'n_planned_parenthood', name: 'Planned Parenthood Action Fund', type: 'organization', baseLean: { D: 92, R: -100, G: 52, L: -28 }, threshold: 68, ralliesGranted: 0 },
    { id: 'n_nrtl', name: 'National Right to Life Committee', type: 'organization', baseLean: { D: -95, R: 90, G: -52, L: -22 }, threshold: 75, ralliesGranted: 0 },
    { id: 'n_hrc', name: 'Human Rights Campaign (HRC)', type: 'organization', baseLean: { D: 90, R: -92, G: 58, L: -18 }, threshold: 68, ralliesGranted: 0 },
    { id: 'n_faith_freedom', name: 'Faith & Freedom Coalition', type: 'organization', baseLean: { D: -88, R: 90, G: -60, L: -28 }, threshold: 75, ralliesGranted: 0 },
    { id: 'n_sierra_club', name: 'Sierra Club', type: 'organization', baseLean: { D: 75, R: -82, G: 82, L: -8 }, threshold: 68, ralliesGranted: 0 },
    { id: 'n_lcv', name: 'League of Conservation Voters (LCV)', type: 'organization', baseLean: { D: 80, R: -75, G: 62, L: -12 }, threshold: 68, ralliesGranted: 0 },
    { id: 'n_uschamber', name: 'U.S. Chamber of Commerce', type: 'organization', baseLean: { D: -22, R: 65, G: -52, L: 32 }, threshold: 62, ralliesGranted: 0 },
    { id: 'n_nfib', name: 'National Federation of Independent Business', type: 'organization', baseLean: { D: -42, R: 75, G: -50, L: 28 }, threshold: 62, ralliesGranted: 0 },
    { id: 'n_afb', name: 'American Farm Bureau Federation', type: 'organization', baseLean: { D: -18, R: 72, G: -32, L: 22 }, threshold: 62, ralliesGranted: 0 },
    { id: 'n_naacp', name: 'NAACP', type: 'organization', baseLean: { D: 85, R: -78, G: 32, L: -18 }, threshold: 68, ralliesGranted: 0 },
    { id: 'n_aarp', name: 'AARP', type: 'organization', baseLean: { D: 18, R: 15, G: 4, L: 4 }, threshold: 58, ralliesGranted: 0 },
    { id: 'n_aclu', name: 'American Civil Liberties Union (ACLU)', type: 'organization', baseLean: { D: 75, R: -88, G: 62, L: 52 }, threshold: 68, ralliesGranted: 0 },
    { id: 'n_aipac', name: 'AIPAC', type: 'organization', baseLean: { D: 28, R: 42, G: -62, L: -18 }, threshold: 68, ralliesGranted: 0 },
    { id: 'n_moveon', name: 'MoveOn.org', type: 'organization', baseLean: { D: 72, R: -95, G: 55, L: -25 }, threshold: 65, ralliesGranted: 0 },
    { id: 'n_heritage', name: 'Heritage Foundation', type: 'organization', baseLean: { D: -90, R: 78, G: -65, L: 18 }, threshold: 72, ralliesGranted: 0 }
  ],
  states: {
    PA: [
      { id: 'pa_shapiro', name: 'Josh Shapiro (PA Governor)', type: 'individual', baseLean: { D: 85, R: -58, G: 5, L: -28 }, threshold: 78, ralliesGranted: 4 },
      { id: 'pa_fetterman', name: 'John Fetterman (PA Senator)', type: 'individual', baseLean: { D: 58, R: -22, G: 5, L: -8 }, threshold: 72, ralliesGranted: 4 },
      { id: 'pa_casey', name: 'Bob Casey Jr. (Former PA Senator)', type: 'individual', baseLean: { D: 72, R: -45, G: 0, L: -18 }, threshold: 62, ralliesGranted: 2 },
      { id: 'pa_paaflcio', name: 'Pennsylvania AFL-CIO', type: 'organization', baseLean: { D: 80, R: -55, G: 15, L: -22 }, threshold: 68, ralliesGranted: 0 },
      { id: 'pa_usw_pittsburgh', name: 'United Steelworkers Pittsburgh District', type: 'organization', baseLean: { D: 62, R: -18, G: 8, L: -10 }, threshold: 65, ralliesGranted: 0 },
      { id: 'pa_inky_editorial', name: 'Philadelphia Inquirer Editorial Board', type: 'organization', baseLean: { D: 68, R: -62, G: 8, L: -8 }, threshold: 58, ralliesGranted: 0 }
    ],
    MI: [
      { id: 'mi_whitmer', name: 'Gretchen Whitmer (MI Governor)', type: 'individual', baseLean: { D: 90, R: -75, G: 10, L: -32 }, threshold: 80, ralliesGranted: 4 },
      { id: 'mi_tlaib', name: 'Rashida Tlaib (MI-12 Rep.)', type: 'individual', baseLean: { D: 58, R: -100, G: 72, L: -38 }, threshold: 82, ralliesGranted: 3 },
      { id: 'mi_slotkin', name: 'Elissa Slotkin (MI Senator)', type: 'individual', baseLean: { D: 75, R: -42, G: 5, L: -15 }, threshold: 70, ralliesGranted: 3 },
      { id: 'mi_uaw_detroit', name: 'UAW Region 1A', type: 'organization', baseLean: { D: 58, R: -22, G: 5, L: -12 }, threshold: 68, ralliesGranted: 0 },
      { id: 'mi_aapac', name: 'Arab American Political Action Committee', type: 'organization', baseLean: { D: 15, R: -32, G: 42, L: 10 }, threshold: 72, ralliesGranted: 0 },
      { id: 'mi_detroit_naacp', name: 'Detroit Branch NAACP', type: 'organization', baseLean: { D: 85, R: -82, G: 22, L: -18 }, threshold: 68, ralliesGranted: 0 }
    ],
    WI: [
      { id: 'wi_evers', name: 'Tony Evers (WI Governor)', type: 'individual', baseLean: { D: 85, R: -75, G: 10, L: -28 }, threshold: 72, ralliesGranted: 3 },
      { id: 'wi_baldwin', name: 'Tammy Baldwin (WI Senator)', type: 'individual', baseLean: { D: 88, R: -82, G: 18, L: -38 }, threshold: 72, ralliesGranted: 3 },
      { id: 'wi_johnson', name: 'Ron Johnson (Former WI Senator)', type: 'individual', baseLean: { D: -90, R: 85, G: -52, L: 8 }, threshold: 78, ralliesGranted: 2 },
      { id: 'wi_afl', name: 'Wisconsin AFL-CIO', type: 'organization', baseLean: { D: 80, R: -58, G: 20, L: -22 }, threshold: 68, ralliesGranted: 0 },
      { id: 'wi_farmbureaufed', name: 'Wisconsin Farm Bureau Federation', type: 'organization', baseLean: { D: -18, R: 65, G: -35, L: 15 }, threshold: 62, ralliesGranted: 0 },
      { id: 'wi_milwaukeejournal', name: 'Milwaukee Journal Sentinel Editorial Board', type: 'organization', baseLean: { D: 52, R: -52, G: 5, L: -5 }, threshold: 55, ralliesGranted: 0 }
    ],
    GA: [
      { id: 'ga_warnock', name: 'Raphael Warnock (GA Senator)', type: 'individual', baseLean: { D: 90, R: -88, G: 15, L: -38 }, threshold: 75, ralliesGranted: 4 },
      { id: 'ga_ossoff', name: 'Jon Ossoff (GA Senator)', type: 'individual', baseLean: { D: 85, R: -80, G: 10, L: -32 }, threshold: 72, ralliesGranted: 3 },
      { id: 'ga_abrams', name: 'Stacey Abrams', type: 'individual', baseLean: { D: 88, R: -95, G: 22, L: -48 }, threshold: 75, ralliesGranted: 4 },
      { id: 'ga_kemp', name: 'Brian Kemp (Former GA Governor)', type: 'individual', baseLean: { D: -55, R: 78, G: -38, L: -12 }, threshold: 78, ralliesGranted: 3 },
      { id: 'ga_new_georgia_project', name: 'New Georgia Project', type: 'organization', baseLean: { D: 90, R: -90, G: 22, L: -30 }, threshold: 68, ralliesGranted: 0 },
      { id: 'ga_ga_chamber', name: 'Georgia Chamber of Commerce', type: 'organization', baseLean: { D: -12, R: 58, G: -40, L: 22 }, threshold: 58, ralliesGranted: 0 }
    ],
    AZ: [
      { id: 'az_gallego', name: 'Ruben Gallego (AZ Senator)', type: 'individual', baseLean: { D: 85, R: -75, G: 10, L: -28 }, threshold: 72, ralliesGranted: 3 },
      { id: 'az_kelly', name: 'Mark Kelly (AZ Senator)', type: 'individual', baseLean: { D: 78, R: -52, G: 5, L: -12 }, threshold: 68, ralliesGranted: 3 },
      { id: 'az_sinema', name: 'Kyrsten Sinema (Former AZ Senator, I)', type: 'individual', baseLean: { D: 28, R: 32, G: -18, L: 22 }, threshold: 82, ralliesGranted: 2 },
      { id: 'az_ducey', name: 'Doug Ducey (Former AZ Governor)', type: 'individual', baseLean: { D: -48, R: 72, G: -35, L: 10 }, threshold: 75, ralliesGranted: 2 },
      { id: 'az_az_aflcio', name: 'Arizona AFL-CIO', type: 'organization', baseLean: { D: 80, R: -55, G: 15, L: -20 }, threshold: 68, ralliesGranted: 0 },
      { id: 'az_lucha', name: 'LUCHA (Living United for Change)', type: 'organization', baseLean: { D: 88, R: -85, G: 25, L: -25 }, threshold: 70, ralliesGranted: 0 }
    ],
    NV: [
      { id: 'nv_cortez_masto', name: 'Catherine Cortez Masto (NV Senator)', type: 'individual', baseLean: { D: 85, R: -70, G: 10, L: -28 }, threshold: 68, ralliesGranted: 3 },
      { id: 'nv_rosen', name: 'Jacky Rosen (NV Senator)', type: 'individual', baseLean: { D: 80, R: -62, G: 5, L: -22 }, threshold: 65, ralliesGranted: 2 },
      { id: 'nv_lombardo', name: 'Joe Lombardo (NV Governor)', type: 'individual', baseLean: { D: -38, R: 78, G: -35, L: 10 }, threshold: 78, ralliesGranted: 2 },
      { id: 'nv_culinary226', name: 'Culinary Workers Union Local 226', type: 'organization', baseLean: { D: 85, R: -62, G: 15, L: -22 }, threshold: 78, ralliesGranted: 0 },
      { id: 'nv_las_vegas_chamber', name: 'Las Vegas Metro Chamber of Commerce', type: 'organization', baseLean: { D: -10, R: 52, G: -32, L: 18 }, threshold: 58, ralliesGranted: 0 },
      { id: 'nv_nevada_resort_assoc', name: 'Nevada Resort Association', type: 'organization', baseLean: { D: 5, R: 48, G: -32, L: 15 }, threshold: 62, ralliesGranted: 0 }
    ],
    NC: [
      { id: 'nc_cooper', name: 'Roy Cooper (Former NC Governor)', type: 'individual', baseLean: { D: 80, R: -62, G: 8, L: -22 }, threshold: 70, ralliesGranted: 3 },
      { id: 'nc_beasley', name: 'Cheri Beasley (Former NC Chief Justice)', type: 'individual', baseLean: { D: 80, R: -72, G: 15, L: -28 }, threshold: 68, ralliesGranted: 2 },
      { id: 'nc_tillis', name: 'Thom Tillis (NC Senator)', type: 'individual', baseLean: { D: -62, R: 72, G: -38, L: -12 }, threshold: 75, ralliesGranted: 2 },
      { id: 'nc_naacp_hkfc', name: 'NC NAACP', type: 'organization', baseLean: { D: 85, R: -82, G: 28, L: -20 }, threshold: 70, ralliesGranted: 0 },
      { id: 'nc_research_triangle', name: 'Research Triangle Business Alliance', type: 'organization', baseLean: { D: 22, R: 38, G: -12, L: 28 }, threshold: 58, ralliesGranted: 0 },
      { id: 'nc_nc_afl', name: 'North Carolina State AFL-CIO', type: 'organization', baseLean: { D: 80, R: -52, G: 15, L: -18 }, threshold: 65, ralliesGranted: 0 }
    ],
    TX: [
      { id: 'tx_abbott', name: 'Greg Abbott (TX Governor)', type: 'individual', baseLean: { D: -90, R: 90, G: -55, L: -18 }, threshold: 85, ralliesGranted: 3 },
      { id: 'tx_orourke', name: "Beto O'Rourke", type: 'individual', baseLean: { D: 85, R: -80, G: 22, L: -18 }, threshold: 68, ralliesGranted: 4 },
      { id: 'tx_cornyn', name: 'John Cornyn (TX Senior Senator)', type: 'individual', baseLean: { D: -82, R: 82, G: -48, L: -12 }, threshold: 78, ralliesGranted: 2 },
      { id: 'tx_cuellar', name: 'Henry Cuellar (TX Rep., D)', type: 'individual', baseLean: { D: 52, R: -15, G: -10, L: 0 }, threshold: 65, ralliesGranted: 2 },
      { id: 'tx_tx_afl', name: 'Texas AFL-CIO', type: 'organization', baseLean: { D: 75, R: -50, G: 15, L: -18 }, threshold: 65, ralliesGranted: 0 },
      { id: 'tx_txbiz_assoc', name: 'Texas Association of Business', type: 'organization', baseLean: { D: -32, R: 75, G: -52, L: 28 }, threshold: 62, ralliesGranted: 0 }
    ],
    FL: [
      { id: 'fl_scott', name: 'Rick Scott (FL Senator)', type: 'individual', baseLean: { D: -85, R: 85, G: -55, L: -12 }, threshold: 80, ralliesGranted: 2 },
      { id: 'fl_crist', name: 'Charlie Crist (Former FL Governor)', type: 'individual', baseLean: { D: 68, R: -28, G: 5, L: -8 }, threshold: 58, ralliesGranted: 2 },
      { id: 'fl_demings', name: 'Val Demings (Former FL Rep.)', type: 'individual', baseLean: { D: 85, R: -80, G: 10, L: -32 }, threshold: 65, ralliesGranted: 3 },
      { id: 'fl_fla_teachers', name: 'Florida Education Association', type: 'organization', baseLean: { D: 85, R: -78, G: 22, L: -28 }, threshold: 68, ralliesGranted: 0 },
      { id: 'fl_cuban_american_natl', name: 'Cuban American National Foundation', type: 'organization', baseLean: { D: -60, R: 82, G: -48, L: 8 }, threshold: 75, ralliesGranted: 0 },
      { id: 'fl_fl_afl', name: 'Florida AFL-CIO', type: 'organization', baseLean: { D: 80, R: -55, G: 15, L: -18 }, threshold: 65, ralliesGranted: 0 }
    ],
    OH: [
      { id: 'oh_brown', name: 'Sherrod Brown (Former OH Senator)', type: 'individual', baseLean: { D: 68, R: -18, G: 8, L: -8 }, threshold: 68, ralliesGranted: 3 },
      { id: 'oh_dewine', name: 'Mike DeWine (OH Governor)', type: 'individual', baseLean: { D: -28, R: 75, G: -28, L: -5 }, threshold: 72, ralliesGranted: 2 },
      { id: 'oh_ryan', name: 'Tim Ryan (Former OH Rep.)', type: 'individual', baseLean: { D: 62, R: -22, G: 5, L: -5 }, threshold: 62, ralliesGranted: 3 },
      { id: 'oh_oh_afl', name: 'Ohio AFL-CIO', type: 'organization', baseLean: { D: 80, R: -50, G: 15, L: -18 }, threshold: 65, ralliesGranted: 0 },
      { id: 'oh_ohio_farm_bureau', name: 'Ohio Farm Bureau Federation', type: 'organization', baseLean: { D: -22, R: 70, G: -38, L: 15 }, threshold: 62, ralliesGranted: 0 },
      { id: 'oh_plain_dealer', name: 'Cleveland Plain Dealer Editorial Board', type: 'organization', baseLean: { D: 52, R: -48, G: 5, L: -5 }, threshold: 55, ralliesGranted: 0 }
    ],
    NY: [
      { id: 'ny_hochul', name: 'Kathy Hochul (NY Governor)', type: 'individual', baseLean: { D: 85, R: -78, G: 10, L: -32 }, threshold: 72, ralliesGranted: 3 },
      { id: 'ny_bloomberg', name: 'Michael Bloomberg (Former NYC Mayor)', type: 'individual', baseLean: { D: 45, R: 18, G: -12, L: 28 }, threshold: 72, ralliesGranted: 2 },
      { id: 'ny_adams', name: 'Eric Adams (NYC Mayor)', type: 'individual', baseLean: { D: 52, R: -18, G: -12, L: -5 }, threshold: 68, ralliesGranted: 2 },
      { id: 'ny_ny_afl', name: 'New York State AFL-CIO', type: 'organization', baseLean: { D: 85, R: -68, G: 20, L: -32 }, threshold: 68, ralliesGranted: 0 },
      { id: 'ny_1199seiu', name: '1199SEIU United Healthcare Workers', type: 'organization', baseLean: { D: 90, R: -80, G: 25, L: -38 }, threshold: 68, ralliesGranted: 0 },
      { id: 'ny_nytimes_editorial', name: 'New York Times Editorial Board', type: 'organization', baseLean: { D: 58, R: -65, G: 12, L: 5 }, threshold: 65, ralliesGranted: 0 }
    ],
    CA: [
      { id: 'ca_newsom', name: 'Gavin Newsom (CA Governor)', type: 'individual', baseLean: { D: 90, R: -95, G: 22, L: -38 }, threshold: 82, ralliesGranted: 4 },
      { id: 'ca_schiff', name: 'Adam Schiff (CA Senator)', type: 'individual', baseLean: { D: 85, R: -90, G: 15, L: -38 }, threshold: 72, ralliesGranted: 2 },
      { id: 'ca_porter', name: 'Katie Porter (CA Rep.)', type: 'individual', baseLean: { D: 72, R: -88, G: 38, L: -18 }, threshold: 72, ralliesGranted: 3 },
      { id: 'ca_cta', name: 'California Teachers Association', type: 'organization', baseLean: { D: 85, R: -75, G: 32, L: -28 }, threshold: 68, ralliesGranted: 0 },
      { id: 'ca_sv_leadership', name: 'Silicon Valley Leadership Group', type: 'organization', baseLean: { D: 25, R: 45, G: -10, L: 35 }, threshold: 65, ralliesGranted: 0 }
    ],
    AL: [
      { id: 'al_tuberville', name: 'Tommy Tuberville (AL Senator)', type: 'individual', baseLean: { D: -95, R: 88, G: -60, L: -15 }, threshold: 78, ralliesGranted: 3 },
      { id: 'al_cotton_tom', name: 'Tom Cotton (AR Senator)', type: 'individual', baseLean: { D: -92, R: 90, G: -58, L: -12 }, threshold: 80, ralliesGranted: 3 },
      { id: 'al_ivey', name: 'Kay Ivey (AL Governor)', type: 'individual', baseLean: { D: -88, R: 85, G: -55, L: -15 }, threshold: 75, ralliesGranted: 2 },
      { id: 'al_jones', name: 'Doug Jones (Former AL Senator)', type: 'individual', baseLean: { D: 72, R: -28, G: 5, L: -10 }, threshold: 62, ralliesGranted: 2 },
      { id: 'al_aea', name: 'Alabama Education Association (AEA)', type: 'organization', baseLean: { D: 78, R: -55, G: 15, L: -20 }, threshold: 65, ralliesGranted: 0 },
      { id: 'al_alfa', name: 'Alabama Farmers Federation (ALFA)', type: 'organization', baseLean: { D: -35, R: 80, G: -48, L: 15 }, threshold: 65, ralliesGranted: 0 }
    ],
    AK: [
      { id: 'ak_murkowski', name: 'Lisa Murkowski (AK Senator)', type: 'individual', baseLean: { D: -18, R: 65, G: -15, L: 20 }, threshold: 75, ralliesGranted: 2 },
      { id: 'ak_sullivan', name: 'Dan Sullivan (AK Senator)', type: 'individual', baseLean: { D: -72, R: 80, G: -42, L: -8 }, threshold: 72, ralliesGranted: 2 },
      { id: 'ak_peltola', name: 'Mary Peltola (Former AK Rep.)', type: 'individual', baseLean: { D: 80, R: -52, G: 18, L: -10 }, threshold: 65, ralliesGranted: 3 },
      { id: 'ak_afn', name: 'Alaska Federation of Natives (AFN)', type: 'organization', baseLean: { D: 62, R: -25, G: 25, L: 5 }, threshold: 65, ralliesGranted: 0 },
      { id: 'ak_aoga', name: 'Alaska Oil & Gas Association', type: 'organization', baseLean: { D: -55, R: 78, G: -80, L: 18 }, threshold: 65, ralliesGranted: 0 }
    ],
    AR: [
      { id: 'ar_sanders_sarah', name: 'Sarah Huckabee Sanders (AR Governor)', type: 'individual', baseLean: { D: -90, R: 90, G: -58, L: -15 }, threshold: 80, ralliesGranted: 3 },
      { id: 'ar_cotton', name: 'Tom Cotton (AR Senator)', type: 'individual', baseLean: { D: -92, R: 90, G: -58, L: -10 }, threshold: 82, ralliesGranted: 3 },
      { id: 'ar_boozman', name: 'John Boozman (AR Senior Senator)', type: 'individual', baseLean: { D: -80, R: 80, G: -50, L: -10 }, threshold: 70, ralliesGranted: 1 },
      { id: 'ar_ar_farm_bureau', name: 'Arkansas Farm Bureau', type: 'organization', baseLean: { D: -28, R: 78, G: -48, L: 15 }, threshold: 62, ralliesGranted: 0 },
      { id: 'ar_walmart_community', name: 'Northwest Arkansas Business Council', type: 'organization', baseLean: { D: -12, R: 60, G: -38, L: 22 }, threshold: 58, ralliesGranted: 0 }
    ],
    CT: [
      { id: 'ct_lamont', name: 'Ned Lamont (CT Governor)', type: 'individual', baseLean: { D: 80, R: -62, G: 10, L: -18 }, threshold: 68, ralliesGranted: 2 },
      { id: 'ct_murphy', name: 'Chris Murphy (CT Senator)', type: 'individual', baseLean: { D: 88, R: -85, G: 25, L: -32 }, threshold: 72, ralliesGranted: 3 },
      { id: 'ct_blumenthal', name: 'Richard Blumenthal (Former CT Senator)', type: 'individual', baseLean: { D: 80, R: -72, G: 12, L: -25 }, threshold: 62, ralliesGranted: 2 },
      { id: 'ct_ct_afl', name: 'Connecticut AFL-CIO', type: 'organization', baseLean: { D: 82, R: -60, G: 18, L: -25 }, threshold: 65, ralliesGranted: 0 },
      { id: 'ct_hartford_courant', name: 'Hartford Courant Editorial Board', type: 'organization', baseLean: { D: 48, R: -45, G: 8, L: 5 }, threshold: 52, ralliesGranted: 0 }
    ],
    DE: [
      { id: 'de_coons', name: 'Chris Coons (DE Senator)', type: 'individual', baseLean: { D: 82, R: -68, G: 8, L: -22 }, threshold: 65, ralliesGranted: 2 },
      { id: 'de_carney', name: 'John Carney (Former DE Governor)', type: 'individual', baseLean: { D: 78, R: -62, G: 5, L: -20 }, threshold: 58, ralliesGranted: 1 },
      { id: 'de_de_afl', name: 'Delaware AFL-CIO', type: 'organization', baseLean: { D: 80, R: -58, G: 15, L: -22 }, threshold: 60, ralliesGranted: 0 },
      { id: 'de_dupont_network', name: 'Delaware Business Roundtable', type: 'organization', baseLean: { D: -8, R: 52, G: -38, L: 22 }, threshold: 55, ralliesGranted: 0 }
    ],
    HI: [
      { id: 'hi_hirono', name: 'Mazie Hirono (HI Senator)', type: 'individual', baseLean: { D: 90, R: -90, G: 28, L: -38 }, threshold: 68, ralliesGranted: 3 },
      { id: 'hi_schatz', name: 'Brian Schatz (HI Senator)', type: 'individual', baseLean: { D: 88, R: -82, G: 32, L: -30 }, threshold: 65, ralliesGranted: 2 },
      { id: 'hi_green', name: 'Josh Green (HI Governor)', type: 'individual', baseLean: { D: 85, R: -72, G: 15, L: -25 }, threshold: 65, ralliesGranted: 2 },
      { id: 'hi_hgea', name: 'Hawaii Government Employees Association (HGEA)', type: 'organization', baseLean: { D: 85, R: -70, G: 20, L: -30 }, threshold: 62, ralliesGranted: 0 },
      { id: 'hi_ilwu_hawaii', name: 'ILWU Hawaii (Longshore & Tourism Workers)', type: 'organization', baseLean: { D: 80, R: -62, G: 18, L: -22 }, threshold: 60, ralliesGranted: 0 }
    ],
    ID: [
      { id: 'id_little', name: 'Brad Little (ID Governor)', type: 'individual', baseLean: { D: -80, R: 82, G: -50, L: 5 }, threshold: 72, ralliesGranted: 2 },
      { id: 'id_risch', name: 'Jim Risch (ID Senior Senator)', type: 'individual', baseLean: { D: -82, R: 82, G: -52, L: -8 }, threshold: 70, ralliesGranted: 1 },
      { id: 'id_crapo', name: 'Mike Crapo (ID Senator)', type: 'individual', baseLean: { D: -80, R: 82, G: -50, L: 5 }, threshold: 70, ralliesGranted: 1 },
      { id: 'id_id_farm_bureau', name: 'Idaho Farm Bureau', type: 'organization', baseLean: { D: -30, R: 80, G: -50, L: 15 }, threshold: 60, ralliesGranted: 0 },
      { id: 'id_id_freedom_caucus', name: 'Idaho Freedom Foundation', type: 'organization', baseLean: { D: -98, R: 72, G: -65, L: 30 }, threshold: 72, ralliesGranted: 0 }
    ],
    IN: [
      { id: 'in_braun', name: 'Mike Braun (IN Governor)', type: 'individual', baseLean: { D: -78, R: 82, G: -45, L: 12 }, threshold: 72, ralliesGranted: 2 },
      { id: 'in_young', name: 'Todd Young (IN Senator)', type: 'individual', baseLean: { D: -55, R: 78, G: -40, L: 5 }, threshold: 68, ralliesGranted: 2 },
      { id: 'in_in_afl', name: 'Indiana AFL-CIO', type: 'organization', baseLean: { D: 75, R: -48, G: 15, L: -18 }, threshold: 62, ralliesGranted: 0 },
      { id: 'in_uaw_indiana', name: 'UAW Indiana Council', type: 'organization', baseLean: { D: 58, R: -22, G: 8, L: -12 }, threshold: 65, ralliesGranted: 0 },
      { id: 'in_indiana_chamber', name: 'Indiana Chamber of Commerce', type: 'organization', baseLean: { D: -28, R: 72, G: -45, L: 20 }, threshold: 58, ralliesGranted: 0 }
    ],
    KS: [
      { id: 'ks_kelly', name: 'Laura Kelly (Former KS Governor)', type: 'individual', baseLean: { D: 75, R: -28, G: 8, L: -8 }, threshold: 65, ralliesGranted: 3 },
      { id: 'ks_marshall', name: 'Roger Marshall (KS Senator)', type: 'individual', baseLean: { D: -88, R: 85, G: -55, L: -10 }, threshold: 72, ralliesGranted: 2 },
      { id: 'ks_moran', name: 'Jerry Moran (KS Senior Senator)', type: 'individual', baseLean: { D: -72, R: 78, G: -45, L: 5 }, threshold: 68, ralliesGranted: 1 },
      { id: 'ks_ks_farm_bureau', name: 'Kansas Farm Bureau', type: 'organization', baseLean: { D: -32, R: 80, G: -50, L: 18 }, threshold: 62, ralliesGranted: 0 },
      { id: 'ks_planned_parenthood_ks', name: 'Planned Parenthood Great Plains', type: 'organization', baseLean: { D: 88, R: -95, G: 48, L: -20 }, threshold: 68, ralliesGranted: 0 }
    ],
    KY: [
      { id: 'ky_beshear', name: 'Andy Beshear (KY Governor)', type: 'individual', baseLean: { D: 72, R: -22, G: 8, L: -8 }, threshold: 72, ralliesGranted: 4 },
      { id: 'ky_paul', name: 'Rand Paul (KY Senator)', type: 'individual', baseLean: { D: -55, R: 55, G: -20, L: 90 }, threshold: 88, ralliesGranted: 3 },
      { id: 'ky_mcconnell_ky', name: 'KY Republican Party Establishment', type: 'organization', baseLean: { D: -90, R: 82, G: -58, L: -15 }, threshold: 72, ralliesGranted: 0 },
      { id: 'ky_umwa_ky', name: 'United Mine Workers of America — KY District', type: 'organization', baseLean: { D: 28, R: 28, G: -15, L: 5 }, threshold: 60, ralliesGranted: 0 },
      { id: 'ky_ky_ed_assoc', name: 'Kentucky Education Association (KEA)', type: 'organization', baseLean: { D: 80, R: -60, G: 20, L: -22 }, threshold: 62, ralliesGranted: 0 }
    ],
    LA: [
      { id: 'la_landry', name: 'Jeff Landry (LA Governor)', type: 'individual', baseLean: { D: -90, R: 88, G: -58, L: -12 }, threshold: 78, ralliesGranted: 3 },
      { id: 'la_kennedy', name: 'John Kennedy (LA Senator)', type: 'individual', baseLean: { D: -88, R: 88, G: -55, L: -8 }, threshold: 72, ralliesGranted: 2 },
      { id: 'la_cassidy', name: 'Bill Cassidy (LA Senator)', type: 'individual', baseLean: { D: -28, R: 62, G: -25, L: 15 }, threshold: 72, ralliesGranted: 2 },
      { id: 'la_la_afl', name: 'Louisiana AFL-CIO', type: 'organization', baseLean: { D: 78, R: -52, G: 18, L: -18 }, threshold: 62, ralliesGranted: 0 },
      { id: 'la_oil_gas_la', name: 'Louisiana Mid-Continent Oil & Gas Association', type: 'organization', baseLean: { D: -58, R: 82, G: -88, L: 20 }, threshold: 65, ralliesGranted: 0 }
    ],
    ME: [
      { id: 'me_collins', name: 'Susan Collins (ME Senator)', type: 'individual', baseLean: { D: -12, R: 62, G: -18, L: 20 }, threshold: 85, ralliesGranted: 2 },
      { id: 'me_king', name: 'Angus King (ME Senator, I)', type: 'individual', baseLean: { D: 35, R: 12, G: 15, L: 30 }, threshold: 78, ralliesGranted: 2 },
      { id: 'me_mills', name: 'Janet Mills (Former ME Governor)', type: 'individual', baseLean: { D: 75, R: -42, G: 10, L: -12 }, threshold: 65, ralliesGranted: 2 },
      { id: 'me_maine_afl', name: 'Maine AFL-CIO', type: 'organization', baseLean: { D: 78, R: -52, G: 20, L: -18 }, threshold: 60, ralliesGranted: 0 },
      { id: 'me_fishing_industry', name: "Maine Lobstermen's Association", type: 'organization', baseLean: { D: -38, R: 65, G: -55, L: 12 }, threshold: 58, ralliesGranted: 0 }
    ],
    MD: [
      { id: 'md_moore', name: 'Wes Moore (MD Governor)', type: 'individual', baseLean: { D: 90, R: -80, G: 18, L: -32 }, threshold: 80, ralliesGranted: 4 },
      { id: 'md_van_hollen', name: 'Chris Van Hollen (MD Senator)', type: 'individual', baseLean: { D: 85, R: -80, G: 20, L: -30 }, threshold: 65, ralliesGranted: 2 },
      { id: 'md_hogan', name: 'Larry Hogan (Former MD Governor)', type: 'individual', baseLean: { D: -18, R: 58, G: -15, L: 18 }, threshold: 72, ralliesGranted: 2 },
      { id: 'md_msea', name: 'Maryland State Education Association (MSEA)', type: 'organization', baseLean: { D: 85, R: -72, G: 22, L: -28 }, threshold: 62, ralliesGranted: 0 },
      { id: 'md_bmore_naacp', name: 'Baltimore City NAACP', type: 'organization', baseLean: { D: 88, R: -85, G: 25, L: -20 }, threshold: 65, ralliesGranted: 0 }
    ],
    MA: [
      { id: 'ma_healey', name: 'Maura Healey (MA Governor)', type: 'individual', baseLean: { D: 88, R: -82, G: 25, L: -25 }, threshold: 75, ralliesGranted: 3 },
      { id: 'ma_markey', name: 'Ed Markey (MA Senator)', type: 'individual', baseLean: { D: 82, R: -88, G: 65, L: -25 }, threshold: 68, ralliesGranted: 2 },
      { id: 'ma_pressley', name: 'Ayanna Pressley (MA-7 Rep.)', type: 'individual', baseLean: { D: 78, R: -95, G: 65, L: -35 }, threshold: 72, ralliesGranted: 3 },
      { id: 'ma_ma_afl', name: 'Massachusetts AFL-CIO', type: 'organization', baseLean: { D: 85, R: -65, G: 20, L: -28 }, threshold: 65, ralliesGranted: 0 },
      { id: 'ma_globe_editorial', name: 'Boston Globe Editorial Board', type: 'organization', baseLean: { D: 68, R: -72, G: 15, L: 5 }, threshold: 60, ralliesGranted: 0 }
    ],
    MO: [
      { id: 'mo_hawley', name: 'Josh Hawley (MO Senator)', type: 'individual', baseLean: { D: -90, R: 80, G: -55, L: -15 }, threshold: 82, ralliesGranted: 3 },
      { id: 'mo_schmitt', name: 'Eric Schmitt (MO Senator)', type: 'individual', baseLean: { D: -85, R: 85, G: -52, L: -10 }, threshold: 72, ralliesGranted: 2 },
      { id: 'mo_kehoe', name: 'Mike Kehoe (MO Governor)', type: 'individual', baseLean: { D: -80, R: 82, G: -50, L: -10 }, threshold: 70, ralliesGranted: 2 },
      { id: 'mo_mo_farm_bureau', name: 'Missouri Farm Bureau', type: 'organization', baseLean: { D: -28, R: 78, G: -48, L: 18 }, threshold: 60, ralliesGranted: 0 },
      { id: 'mo_teamsters_stlouis', name: 'Teamsters Joint Council 13 (St. Louis)', type: 'organization', baseLean: { D: 18, R: 22, G: -5, L: 8 }, threshold: 60, ralliesGranted: 0 }
    ],
    MS: [
      { id: 'ms_reeves', name: 'Tate Reeves (MS Governor)', type: 'individual', baseLean: { D: -90, R: 88, G: -58, L: -15 }, threshold: 78, ralliesGranted: 2 },
      { id: 'ms_wicker', name: 'Roger Wicker (MS Senior Senator)', type: 'individual', baseLean: { D: -82, R: 82, G: -52, L: -10 }, threshold: 70, ralliesGranted: 1 },
      { id: 'ms_bennie_thompson', name: 'Bennie Thompson (MS-2 Rep.)', type: 'individual', baseLean: { D: 88, R: -90, G: 20, L: -38 }, threshold: 65, ralliesGranted: 2 },
      { id: 'ms_ms_naacp', name: 'Mississippi State Conference of the NAACP', type: 'organization', baseLean: { D: 88, R: -85, G: 22, L: -22 }, threshold: 65, ralliesGranted: 0 },
      { id: 'ms_ms_econ_council', name: 'Mississippi Economic Council', type: 'organization', baseLean: { D: -32, R: 78, G: -48, L: 15 }, threshold: 58, ralliesGranted: 0 }
    ],
    MT: [
      { id: 'mt_tester', name: 'Jon Tester (Former MT Senator)', type: 'individual', baseLean: { D: 65, R: -18, G: 10, L: -5 }, threshold: 62, ralliesGranted: 3 },
      { id: 'mt_daines', name: 'Steve Daines (MT Senator)', type: 'individual', baseLean: { D: -80, R: 85, G: -48, L: 5 }, threshold: 72, ralliesGranted: 2 },
      { id: 'mt_gianforte', name: 'Greg Gianforte (MT Governor)', type: 'individual', baseLean: { D: -82, R: 82, G: -52, L: -5 }, threshold: 70, ralliesGranted: 2 },
      { id: 'mt_mt_farm_bureau', name: 'Montana Farm Bureau', type: 'organization', baseLean: { D: -30, R: 78, G: -48, L: 15 }, threshold: 58, ralliesGranted: 0 },
      { id: 'mt_mt_afl', name: 'Montana AFL-CIO', type: 'organization', baseLean: { D: 72, R: -38, G: 18, L: -12 }, threshold: 58, ralliesGranted: 0 }
    ],
    NE: [
      { id: 'ne_fischer', name: 'Deb Fischer (NE Senior Senator)', type: 'individual', baseLean: { D: -80, R: 82, G: -50, L: -5 }, threshold: 68, ralliesGranted: 1 },
      { id: 'ne_ricketts', name: 'Pete Ricketts (NE Senator)', type: 'individual', baseLean: { D: -80, R: 85, G: -52, L: -8 }, threshold: 72, ralliesGranted: 2 },
      { id: 'ne_pillen', name: 'Jim Pillen (NE Governor)', type: 'individual', baseLean: { D: -82, R: 82, G: -52, L: -8 }, threshold: 70, ralliesGranted: 2 },
      { id: 'ne_ne_farm_bureau', name: 'Nebraska Farm Bureau', type: 'organization', baseLean: { D: -28, R: 80, G: -50, L: 18 }, threshold: 60, ralliesGranted: 0 },
      { id: 'ne_omaha_chamber', name: 'Greater Omaha Chamber of Commerce', type: 'organization', baseLean: { D: -8, R: 55, G: -35, L: 22 }, threshold: 55, ralliesGranted: 0 }
    ],
    NM: [
      { id: 'nm_lujan_grisham', name: 'Michelle Lujan Grisham (NM Governor)', type: 'individual', baseLean: { D: 85, R: -75, G: 15, L: -28 }, threshold: 68, ralliesGranted: 3 },
      { id: 'nm_heinrich', name: 'Martin Heinrich (NM Senator)', type: 'individual', baseLean: { D: 82, R: -70, G: 25, L: -18 }, threshold: 62, ralliesGranted: 2 },
      { id: 'nm_lujan', name: 'Ben Ray Luján (NM Senator)', type: 'individual', baseLean: { D: 85, R: -72, G: 18, L: -25 }, threshold: 62, ralliesGranted: 2 },
      { id: 'nm_nm_afl', name: 'New Mexico Federation of Labor (AFL-CIO)', type: 'organization', baseLean: { D: 80, R: -55, G: 18, L: -20 }, threshold: 60, ralliesGranted: 0 },
      { id: 'nm_chci', name: 'Congressional Hispanic Caucus Institute (NM Chapter)', type: 'organization', baseLean: { D: 85, R: -72, G: 22, L: -18 }, threshold: 62, ralliesGranted: 0 }
    ],
    ND: [
      { id: 'nd_burgum', name: 'Doug Burgum (Former ND Governor)', type: 'individual', baseLean: { D: -72, R: 82, G: -48, L: 10 }, threshold: 70, ralliesGranted: 2 },
      { id: 'nd_cramer', name: 'Kevin Cramer (ND Senator)', type: 'individual', baseLean: { D: -82, R: 85, G: -55, L: -8 }, threshold: 68, ralliesGranted: 1 },
      { id: 'nd_hoeven', name: 'John Hoeven (ND Senior Senator)', type: 'individual', baseLean: { D: -78, R: 82, G: -50, L: -5 }, threshold: 65, ralliesGranted: 1 },
      { id: 'nd_nd_farm_bureau', name: 'North Dakota Farm Bureau', type: 'organization', baseLean: { D: -30, R: 82, G: -52, L: 18 }, threshold: 58, ralliesGranted: 0 },
      { id: 'nd_standing_rock', name: 'Standing Rock Sioux Tribe', type: 'organization', baseLean: { D: 65, R: -62, G: 55, L: 5 }, threshold: 65, ralliesGranted: 0 }
    ],
    OK: [
      { id: 'ok_stitt', name: 'Kevin Stitt (OK Governor)', type: 'individual', baseLean: { D: -88, R: 85, G: -55, L: -10 }, threshold: 72, ralliesGranted: 2 },
      { id: 'ok_lankford', name: 'James Lankford (OK Senator)', type: 'individual', baseLean: { D: -88, R: 82, G: -55, L: -15 }, threshold: 72, ralliesGranted: 2 },
      { id: 'ok_mullin', name: 'Markwayne Mullin (OK Senator)', type: 'individual', baseLean: { D: -90, R: 88, G: -58, L: -10 }, threshold: 72, ralliesGranted: 3 },
      { id: 'ok_cherokee_nation', name: 'Cherokee Nation', type: 'organization', baseLean: { D: 60, R: -38, G: 25, L: 5 }, threshold: 65, ralliesGranted: 0 },
      { id: 'ok_ok_farm_bureau', name: 'Oklahoma Farm Bureau', type: 'organization', baseLean: { D: -32, R: 80, G: -50, L: 18 }, threshold: 58, ralliesGranted: 0 }
    ],
    OR: [
      { id: 'or_kotek', name: 'Tina Kotek (OR Governor)', type: 'individual', baseLean: { D: 85, R: -78, G: 25, L: -22 }, threshold: 68, ralliesGranted: 3 },
      { id: 'or_merkley', name: 'Jeff Merkley (OR Senator)', type: 'individual', baseLean: { D: 85, R: -82, G: 40, L: -25 }, threshold: 68, ralliesGranted: 2 },
      { id: 'or_wyden', name: 'Ron Wyden (OR Senator)', type: 'individual', baseLean: { D: 82, R: -72, G: 28, L: -15 }, threshold: 62, ralliesGranted: 2 },
      { id: 'or_or_afl', name: 'Oregon AFL-CIO', type: 'organization', baseLean: { D: 82, R: -60, G: 25, L: -20 }, threshold: 62, ralliesGranted: 0 },
      { id: 'or_sierra_or', name: 'Sierra Club Oregon Chapter', type: 'organization', baseLean: { D: 72, R: -82, G: 88, L: -5 }, threshold: 60, ralliesGranted: 0 }
    ],
    RI: [
      { id: 'ri_reed', name: 'Jack Reed (RI Senator)', type: 'individual', baseLean: { D: 82, R: -52, G: 12, L: -18 }, threshold: 65, ralliesGranted: 2 },
      { id: 'ri_whitehouse', name: 'Sheldon Whitehouse (RI Senator)', type: 'individual', baseLean: { D: 85, R: -80, G: 40, L: -25 }, threshold: 65, ralliesGranted: 2 },
      { id: 'ri_mckenney', name: 'Dan McKee (Former RI Governor)', type: 'individual', baseLean: { D: 75, R: -60, G: 10, L: -20 }, threshold: 55, ralliesGranted: 1 },
      { id: 'ri_ri_afl', name: 'Rhode Island AFL-CIO', type: 'organization', baseLean: { D: 82, R: -58, G: 18, L: -22 }, threshold: 58, ralliesGranted: 0 }
    ],
    SD: [
      { id: 'sd_thune', name: 'John Thune (SD Senator / Senate Majority Leader)', type: 'individual', baseLean: { D: -78, R: 88, G: -52, L: -8 }, threshold: 80, ralliesGranted: 2 },
      { id: 'sd_noem', name: 'Kristi Noem (Former SD Governor)', type: 'individual', baseLean: { D: -88, R: 75, G: -55, L: -12 }, threshold: 70, ralliesGranted: 3 },
      { id: 'sd_rounds', name: 'Mike Rounds (SD Senator)', type: 'individual', baseLean: { D: -65, R: 80, G: -45, L: -5 }, threshold: 65, ralliesGranted: 1 },
      { id: 'sd_sd_farm_bureau', name: 'South Dakota Farm Bureau', type: 'organization', baseLean: { D: -28, R: 80, G: -50, L: 18 }, threshold: 58, ralliesGranted: 0 },
      { id: 'sd_oglala_sioux', name: 'Oglala Sioux Tribe (Pine Ridge)', type: 'organization', baseLean: { D: 65, R: -65, G: 52, L: 5 }, threshold: 62, ralliesGranted: 0 }
    ],
    TN: [
      { id: 'tn_blackburn', name: 'Marsha Blackburn (TN Senator)', type: 'individual', baseLean: { D: -92, R: 88, G: -58, L: -15 }, threshold: 75, ralliesGranted: 2 },
      { id: 'tn_hagerty', name: 'Bill Hagerty (TN Senator)', type: 'individual', baseLean: { D: -82, R: 85, G: -52, L: -8 }, threshold: 70, ralliesGranted: 2 },
      { id: 'tn_lee', name: 'Bill Lee (TN Governor)', type: 'individual', baseLean: { D: -82, R: 85, G: -52, L: -8 }, threshold: 70, ralliesGranted: 2 },
      { id: 'tn_nashville_chamber', name: 'Nashville Area Chamber of Commerce', type: 'organization', baseLean: { D: -8, R: 58, G: -35, L: 25 }, threshold: 55, ralliesGranted: 0 },
      { id: 'tn_tn_afl', name: 'Tennessee AFL-CIO', type: 'organization', baseLean: { D: 75, R: -50, G: 18, L: -18 }, threshold: 60, ralliesGranted: 0 }
    ],
    UT: [
      { id: 'ut_cox', name: 'Spencer Cox (UT Governor)', type: 'individual', baseLean: { D: -25, R: 72, G: -20, L: 15 }, threshold: 72, ralliesGranted: 2 },
      { id: 'ut_lee', name: 'Mike Lee (UT Senator)', type: 'individual', baseLean: { D: -72, R: 72, G: -38, L: 55 }, threshold: 78, ralliesGranted: 2 },
      { id: 'ut_lds_influence', name: 'Utah Eagle Forum (LDS Conservative Network)', type: 'organization', baseLean: { D: -65, R: 78, G: -42, L: 15 }, threshold: 70, ralliesGranted: 0 },
      { id: 'ut_silicon_slopes', name: 'Silicon Slopes Tech Alliance', type: 'organization', baseLean: { D: 5, R: 48, G: -12, L: 48 }, threshold: 58, ralliesGranted: 0 },
      { id: 'ut_ut_farm_bureau', name: 'Utah Farm Bureau', type: 'organization', baseLean: { D: -32, R: 80, G: -50, L: 15 }, threshold: 55, ralliesGranted: 0 }
    ],
    VT: [
      { id: 'vt_scott', name: 'Phil Scott (VT Governor)', type: 'individual', baseLean: { D: 12, R: 68, G: 5, L: 28 }, threshold: 82, ralliesGranted: 3 },
      { id: 'vt_welch', name: 'Peter Welch (VT Senator)', type: 'individual', baseLean: { D: 82, R: -78, G: 40, L: -20 }, threshold: 60, ralliesGranted: 2 },
      { id: 'vt_vt_afl', name: 'Vermont AFL-CIO', type: 'organization', baseLean: { D: 80, R: -55, G: 28, L: -18 }, threshold: 58, ralliesGranted: 0 },
      { id: 'vt_vt_farmers_market', name: 'Vermont Fresh Network / Farm & Food Alliance', type: 'organization', baseLean: { D: 65, R: -55, G: 80, L: 5 }, threshold: 55, ralliesGranted: 0 }
    ],
    WA: [
      { id: 'wa_ferguson', name: 'Bob Ferguson (WA Governor)', type: 'individual', baseLean: { D: 88, R: -80, G: 28, L: -22 }, threshold: 72, ralliesGranted: 3 },
      { id: 'wa_murray', name: 'Patty Murray (WA Senior Senator)', type: 'individual', baseLean: { D: 85, R: -75, G: 20, L: -28 }, threshold: 65, ralliesGranted: 2 },
      { id: 'wa_cantwell', name: 'Maria Cantwell (WA Senator)', type: 'individual', baseLean: { D: 82, R: -68, G: 18, L: 5 }, threshold: 65, ralliesGranted: 2 },
      { id: 'wa_wa_labor_council', name: 'Washington State Labor Council (AFL-CIO)', type: 'organization', baseLean: { D: 85, R: -62, G: 25, L: -22 }, threshold: 65, ralliesGranted: 0 },
      { id: 'wa_tech_alliance', name: 'Washington Technology Industry Association', type: 'organization', baseLean: { D: 35, R: 20, G: 12, L: 42 }, threshold: 60, ralliesGranted: 0 }
    ],
    WV: [
      { id: 'wv_justice', name: 'Jim Justice (WV Senator)', type: 'individual', baseLean: { D: -82, R: 85, G: -52, L: -8 }, threshold: 70, ralliesGranted: 2 },
      { id: 'wv_morrisey', name: 'Patrick Morrisey (WV Governor)', type: 'individual', baseLean: { D: -80, R: 82, G: -50, L: -8 }, threshold: 68, ralliesGranted: 2 },
      { id: 'wv_manchin', name: 'Joe Manchin (Former WV Senator)', type: 'individual', baseLean: { D: 48, R: 22, G: -8, L: 5 }, threshold: 80, ralliesGranted: 3 },
      { id: 'wv_umwa', name: 'United Mine Workers of America (UMWA) National HQ', type: 'organization', baseLean: { D: 28, R: 30, G: -20, L: 5 }, threshold: 65, ralliesGranted: 0 },
      { id: 'wv_wv_chamber', name: 'West Virginia Chamber of Commerce', type: 'organization', baseLean: { D: -38, R: 80, G: -60, L: 15 }, threshold: 58, ralliesGranted: 0 }
    ],
    WY: [
      { id: 'wy_barrasso', name: 'John Barrasso (WY Senior Senator / Senate Republican Whip)', type: 'individual', baseLean: { D: -82, R: 88, G: -55, L: -8 }, threshold: 75, ralliesGranted: 2 },
      { id: 'wy_lummis', name: 'Cynthia Lummis (WY Senator)', type: 'individual', baseLean: { D: -80, R: 82, G: -45, L: 35 }, threshold: 70, ralliesGranted: 2 },
      { id: 'wy_gordon', name: 'Mark Gordon (WY Governor)', type: 'individual', baseLean: { D: -78, R: 82, G: -50, L: -5 }, threshold: 68, ralliesGranted: 1 },
      { id: 'wy_stock_growers', name: 'Wyoming Stock Growers Association', type: 'organization', baseLean: { D: -38, R: 85, G: -55, L: 18 }, threshold: 60, ralliesGranted: 0 },
      { id: 'wy_energy_assoc', name: 'Wyoming Energy Authority / Petroleum Association', type: 'organization', baseLean: { D: -60, R: 85, G: -90, L: 18 }, threshold: 62, ralliesGranted: 0 }
    ]
  }
};

// ============================================================
//  Campaign 2028 — Endorsers.db PART 2
//  Remaining states (all not covered in Part 1)
//  Merge this states{} block into the existing endorserDB.states
// ============================================================

const remainingStates = {

  // ── ALABAMA ──────────────────────────────────────────────────
  AL: [
    {
      id: 'al_tuberville',
      name: 'Tommy Tuberville (AL Senator)',
      type: 'individual',
      // Former Auburn football coach; pure MAGA. His endorsement carries
      // enormous weight with white evangelical voters across the Deep South.
      baseLean: { D: -95, R: 88, G: -60, L: -15 },
      threshold: 78,
      ralliesGranted: 3
    },
    {
      id: 'al_cotton_tom',
      name: 'Tom Cotton (AR Senator)',
      type: 'individual',
      // NOTE: Listed here as a Deep South surrogate alongside Tuberville;
      // Cotton's hawkish foreign-policy brand plays well in military-heavy AL.
      // (His primary entry is under AR.)
      baseLean: { D: -92, R: 90, G: -58, L: -12 },
      threshold: 80,
      ralliesGranted: 3
    },
    {
      id: 'al_ivey',
      name: 'Kay Ivey (AL Governor)',
      type: 'individual',
      // Term-limited traditional R governor. Her endorsement is the
      // establishment R seal of approval in AL.
      baseLean: { D: -88, R: 85, G: -55, L: -15 },
      threshold: 75,
      ralliesGranted: 2
    },
    {
      id: 'al_jones',
      name: 'Doug Jones (Former AL Senator)',
      type: 'individual',
      // Won 2017 special election against Roy Moore; lost 2020. The most
      // credible D in AL; his crossover brand is all they have there.
      baseLean: { D: 72, R: -28, G: 5, L: -10 },
      threshold: 62,
      ralliesGranted: 2
    },
    {
      id: 'al_aea',
      name: 'Alabama Education Association (AEA)',
      type: 'organization',
      // Historically powerful statewide; one of the few D-leaning institutions
      // with real organizational muscle in AL.
      baseLean: { D: 78, R: -55, G: 15, L: -20 },
      threshold: 65,
      ralliesGranted: 0
    },
    {
      id: 'al_alfa',
      name: 'Alabama Farmers Federation (ALFA)',
      type: 'organization',
      // One of the most powerful lobbying organizations in the state.
      // Deeply R-aligned; essential for any R candidate to avoid opposition.
      baseLean: { D: -35, R: 80, G: -48, L: 15 },
      threshold: 65,
      ralliesGranted: 0
    },
  ],

  // ── ALASKA ───────────────────────────────────────────────────
  AK: [
    {
      id: 'ak_murkowski',
      name: 'Lisa Murkowski (AK Senator)',
      type: 'individual',
      // One of the last true moderate Rs. Survived 2022 via ranked-choice.
      // Her endorsement is uniquely valuable for crossover/unity messaging.
      baseLean: { D: -18, R: 65, G: -15, L: 20 },
      threshold: 75,
      ralliesGranted: 2
    },
    {
      id: 'ak_sullivan',
      name: 'Dan Sullivan (AK Senator)',
      type: 'individual',
      // Marine veteran; more traditional R than Murkowski. Arctic/military
      // infrastructure focus.
      baseLean: { D: -72, R: 80, G: -42, L: -8 },
      threshold: 72,
      ralliesGranted: 2
    },
    {
      id: 'ak_peltola',
      name: 'Mary Peltola (Former AK Rep.)',
      type: 'individual',
      // First Alaska Native elected to Congress; lost 2024 re-election.
      // Key for Indigenous communities and rural AK Ds.
      baseLean: { D: 80, R: -52, G: 18, L: -10 },
      threshold: 65,
      ralliesGranted: 3
    },
    {
      id: 'ak_afn',
      name: 'Alaska Federation of Natives (AFN)',
      type: 'organization',
      // Represents 229 federally recognized tribes. Their endorsement
      // is the most important mobilizing signal for rural AK Native communities.
      baseLean: { D: 62, R: -25, G: 25, L: 5 },
      threshold: 65,
      ralliesGranted: 0
    },
    {
      id: 'ak_aoga',
      name: 'Alaska Oil & Gas Association',
      type: 'organization',
      // The Prudhoe Bay economy means energy policy is THE issue in AK.
      // Their endorsement reflects the single most important industry in the state.
      baseLean: { D: -55, R: 78, G: -80, L: 18 },
      threshold: 65,
      ralliesGranted: 0
    },
  ],

  // ── ARKANSAS ─────────────────────────────────────────────────
  AR: [
    {
      id: 'ar_sanders_sarah',
      name: 'Sarah Huckabee Sanders (AR Governor)',
      type: 'individual',
      // Former Trump press secretary turned governor; MAGA royalty.
      // One of the most recognized R faces in the South.
      baseLean: { D: -90, R: 90, G: -58, L: -15 },
      threshold: 80,
      ralliesGranted: 3
    },
    {
      id: 'ar_cotton',
      name: 'Tom Cotton (AR Senator)',
      type: 'individual',
      // Harvard Law + Army Ranger + hardline hawk. A future presidential
      // candidate himself; his endorsement is coveted by the R hawk wing.
      baseLean: { D: -92, R: 90, G: -58, L: -10 },
      threshold: 82,
      ralliesGranted: 3
    },
    {
      id: 'ar_boozman',
      name: 'John Boozman (AR Senior Senator)',
      type: 'individual',
      // Low-key institutionalist R. His endorsement signals the AR
      // establishment's blessing without MAGA theatrics.
      baseLean: { D: -80, R: 80, G: -50, L: -10 },
      threshold: 70,
      ralliesGranted: 1
    },
    {
      id: 'ar_ar_farm_bureau',
      name: 'Arkansas Farm Bureau',
      type: 'organization',
      // Delta rice and soybeans economy. Trade policy is the key lever
      // here; strongly R but sensitive to agricultural export disruption.
      baseLean: { D: -28, R: 78, G: -48, L: 15 },
      threshold: 62,
      ralliesGranted: 0
    },
    {
      id: 'ar_walmart_community',
      name: 'Northwest Arkansas Business Council',
      type: 'organization',
      // Walmart HQ, Tyson Foods, J.B. Hunt — the NW AR business corridor
      // is one of the most dynamic in the South. More moderate than state avg.
      baseLean: { D: -12, R: 60, G: -38, L: 22 },
      threshold: 58,
      ralliesGranted: 0
    },
  ],

  // ── CONNECTICUT ──────────────────────────────────────────────
  CT: [
    {
      id: 'ct_lamont',
      name: 'Ned Lamont (CT Governor)',
      type: 'individual',
      // Centrist D; tech billionaire background. Popular in Fairfield County.
      // His endorsement signals the Hartford + suburban D establishment.
      baseLean: { D: 80, R: -62, G: 10, L: -18 },
      threshold: 68,
      ralliesGranted: 2
    },
    {
      id: 'ct_murphy',
      name: 'Chris Murphy (CT Senator)',
      type: 'individual',
      // The face of the gun-control movement post-Sandy Hook.
      // His endorsement galvanizes urban and suburban progressive voters nationally.
      baseLean: { D: 88, R: -85, G: 25, L: -32 },
      threshold: 72,
      ralliesGranted: 3
    },
    {
      id: 'ct_blumenthal',
      name: 'Richard Blumenthal (Former CT Senator)',
      type: 'individual',
      // Vietnam-record controversy aside, still strong with CT Jewish voters
      // and coastal liberals.
      baseLean: { D: 80, R: -72, G: 12, L: -25 },
      threshold: 62,
      ralliesGranted: 2
    },
    {
      id: 'ct_ct_afl',
      name: 'Connecticut AFL-CIO',
      type: 'organization',
      baseLean: { D: 82, R: -60, G: 18, L: -25 },
      threshold: 65,
      ralliesGranted: 0
    },
    {
      id: 'ct_hartford_courant',
      name: 'Hartford Courant Editorial Board',
      type: 'organization',
      // America\'s oldest continuously published newspaper. Moderate;
      // has endorsed both parties in statewide races.
      baseLean: { D: 48, R: -45, G: 8, L: 5 },
      threshold: 52,
      ralliesGranted: 0
    },
  ],

  // ── DELAWARE ─────────────────────────────────────────────────
  DE: [
    {
      id: 'de_coons',
      name: 'Chris Coons (DE Senator)',
      type: 'individual',
      // Biden\'s closest Senate ally; foreign policy centrist D.
      // His endorsement reflects Biden World\'s approval.
      baseLean: { D: 82, R: -68, G: 8, L: -22 },
      threshold: 65,
      ralliesGranted: 2
    },
    {
      id: 'de_carney',
      name: 'John Carney (Former DE Governor)',
      type: 'individual',
      // Now Wilmington mayor; former congressman. Party loyalty D.
      baseLean: { D: 78, R: -62, G: 5, L: -20 },
      threshold: 58,
      ralliesGranted: 1
    },
    {
      id: 'de_de_afl',
      name: 'Delaware AFL-CIO',
      type: 'organization',
      baseLean: { D: 80, R: -58, G: 15, L: -22 },
      threshold: 60,
      ralliesGranted: 0
    },
    {
      id: 'de_dupont_network',
      name: 'Delaware Business Roundtable',
      type: 'organization',
      // DuPont, AstraZeneca, and the Delaware corporate law ecosystem.
      // Moderate R-leaning; sensitive to corporate tax policy.
      baseLean: { D: -8, R: 52, G: -38, L: 22 },
      threshold: 55,
      ralliesGranted: 0
    },
  ],

  // ── HAWAII ───────────────────────────────────────────────────
  HI: [
    {
      id: 'hi_hirono',
      name: 'Mazie Hirono (HI Senator)',
      type: 'individual',
      // First Asian-American woman elected to the Senate; fierce progressive.
      // Beloved in HI; her endorsement matters for AAPI communities nationally.
      baseLean: { D: 90, R: -90, G: 28, L: -38 },
      threshold: 68,
      ralliesGranted: 3
    },
    {
      id: 'hi_schatz',
      name: 'Brian Schatz (HI Senator)',
      type: 'individual',
      // Climate hawk; tech-forward progressive. One of the most active
      // social media senators; strong with young voters.
      baseLean: { D: 88, R: -82, G: 32, L: -30 },
      threshold: 65,
      ralliesGranted: 2
    },
    {
      id: 'hi_green',
      name: 'Josh Green (HI Governor)',
      type: 'individual',
      // ER doctor turned governor; won on healthcare platform.
      // Popular following Maui wildfire response.
      baseLean: { D: 85, R: -72, G: 15, L: -25 },
      threshold: 65,
      ralliesGranted: 2
    },
    {
      id: 'hi_hgea',
      name: 'Hawaii Government Employees Association (HGEA)',
      type: 'organization',
      // Largest union in HI; public sector workers. Dominates HI D politics.
      baseLean: { D: 85, R: -70, G: 20, L: -30 },
      threshold: 62,
      ralliesGranted: 0
    },
    {
      id: 'hi_ilwu_hawaii',
      name: 'ILWU Hawaii (Longshore & Tourism Workers)',
      type: 'organization',
      // Tourism and port economy makes ILWU a key labor endorser in HI.
      baseLean: { D: 80, R: -62, G: 18, L: -22 },
      threshold: 60,
      ralliesGranted: 0
    },
  ],

  // ── IDAHO ────────────────────────────────────────────────────
  ID: [
    {
      id: 'id_little',
      name: 'Brad Little (ID Governor)',
      type: 'individual',
      // Traditional R; ranching background. Survived a MAGA primary
      // challenge in 2022, signaling he\'s the establishment pick.
      baseLean: { D: -80, R: 82, G: -50, L: 5 },
      threshold: 72,
      ralliesGranted: 2
    },
    {
      id: 'id_risch',
      name: 'Jim Risch (ID Senior Senator)',
      type: 'individual',
      // Foreign Relations Committee ranking member; hawkish R.
      baseLean: { D: -82, R: 82, G: -52, L: -8 },
      threshold: 70,
      ralliesGranted: 1
    },
    {
      id: 'id_crapo',
      name: 'Mike Crapo (ID Senator)',
      type: 'individual',
      // Finance Committee powerhouse; LDS background.
      // His endorsement mobilizes the Mormon fiscal-conservative community.
      baseLean: { D: -80, R: 82, G: -50, L: 5 },
      threshold: 70,
      ralliesGranted: 1
    },
    {
      id: 'id_id_farm_bureau',
      name: 'Idaho Farm Bureau',
      type: 'organization',
      // Potato, dairy, and wheat economy. Water rights and irrigation
      // are the key issues here.
      baseLean: { D: -30, R: 80, G: -50, L: 15 },
      threshold: 60,
      ralliesGranted: 0
    },
    {
      id: 'id_id_freedom_caucus',
      name: 'Idaho Freedom Foundation',
      type: 'organization',
      // The most influential hard-right think tank in ID; drives the
      // state\'s sharp rightward drift. Key for MAGA primary voters.
      baseLean: { D: -98, R: 72, G: -65, L: 30 },
      threshold: 72,
      ralliesGranted: 0
    },
  ],

  // ── INDIANA ──────────────────────────────────────────────────
  IN: [
    {
      id: 'in_braun',
      name: 'Mike Braun (IN Governor)',
      type: 'individual',
      // Self-made millionaire; anti-establishment R. Won 2024 governor race.
      // More libertarian-adjacent than typical Midwest Rs.
      baseLean: { D: -78, R: 82, G: -45, L: 12 },
      threshold: 72,
      ralliesGranted: 2
    },
    {
      id: 'in_young',
      name: 'Todd Young (IN Senator)',
      type: 'individual',
      // Marine + Harvard Law; traditional national-security R.
      // More institutionalist than MAGA; works across the aisle occasionally.
      baseLean: { D: -55, R: 78, G: -40, L: 5 },
      threshold: 68,
      ralliesGranted: 2
    },
    {
      id: 'in_in_afl',
      name: 'Indiana AFL-CIO',
      type: 'organization',
      // Right-to-work state since 2012 but still relevant in Gary/Hammond
      // steel corridor and auto-adjacent communities.
      baseLean: { D: 75, R: -48, G: 15, L: -18 },
      threshold: 62,
      ralliesGranted: 0
    },
    {
      id: 'in_uaw_indiana',
      name: 'UAW Indiana Council',
      type: 'organization',
      // Subaru, Stellantis, Honda plants make IN a significant auto state.
      // Swingable on manufacturing/EV policy.
      baseLean: { D: 58, R: -22, G: 8, L: -12 },
      threshold: 65,
      ralliesGranted: 0
    },
    {
      id: 'in_indiana_chamber',
      name: 'Indiana Chamber of Commerce',
      type: 'organization',
      baseLean: { D: -28, R: 72, G: -45, L: 20 },
      threshold: 58,
      ralliesGranted: 0
    },
  ],

  // ── KANSAS ───────────────────────────────────────────────────
  KS: [
    {
      id: 'ks_kelly',
      name: 'Laura Kelly (Former KS Governor)',
      type: 'individual',
      // Term-limited D governor in a deep-red state; won twice on
      // Medicaid expansion. The D blueprint for non-coastal survival.
      baseLean: { D: 75, R: -28, G: 8, L: -8 },
      threshold: 65,
      ralliesGranted: 3
    },
    {
      id: 'ks_marshall',
      name: 'Roger Marshall (KS Senator)',
      type: 'individual',
      // OB/GYN turned MAGA senator. Key with the evangelical medical
      // community and rural western Kansas.
      baseLean: { D: -88, R: 85, G: -55, L: -10 },
      threshold: 72,
      ralliesGranted: 2
    },
    {
      id: 'ks_moran',
      name: 'Jerry Moran (KS Senior Senator)',
      type: 'individual',
      // VA Committee chair emeritus; more mainstream R than Marshall.
      // Veterans and rural Western KS credibility.
      baseLean: { D: -72, R: 78, G: -45, L: 5 },
      threshold: 68,
      ralliesGranted: 1
    },
    {
      id: 'ks_ks_farm_bureau',
      name: 'Kansas Farm Bureau',
      type: 'organization',
      // Wheat capital of America. Their endorsement is the single most
      // important agricultural signal in the state.
      baseLean: { D: -32, R: 80, G: -50, L: 18 },
      threshold: 62,
      ralliesGranted: 0
    },
    {
      id: 'ks_planned_parenthood_ks',
      name: 'Planned Parenthood Great Plains',
      type: 'organization',
      // Kansas passed a constitutional amendment protecting abortion in 2022
      // — a stunning upset. This org drove that campaign and is now the
      // most energized D-aligned force in the state.
      baseLean: { D: 88, R: -95, G: 48, L: -20 },
      threshold: 68,
      ralliesGranted: 0
    },
  ],

  // ── KENTUCKY ─────────────────────────────────────────────────
  KY: [
    {
      id: 'ky_beshear',
      name: 'Andy Beshear (KY Governor)',
      type: 'individual',
      // Two-term D governor in a state Trump won by 26 points. The most
      // remarkable D electoral survivor in the country; potential future
      // national candidate. His crossover brand is nearly unique.
      baseLean: { D: 72, R: -22, G: 8, L: -8 },
      threshold: 72,
      ralliesGranted: 4
    },
    {
      id: 'ky_paul',
      name: 'Rand Paul (KY Senator)',
      type: 'individual',
      // The libertarian wing\'s most prominent voice. Will endorse
      // almost no one on foreign policy grounds; near-impossible to get.
      // But his blessing unlocks the liberty-movement grassroots.
      baseLean: { D: -55, R: 55, G: -20, L: 90 },
      threshold: 88,
      ralliesGranted: 3
    },
    {
      id: 'ky_mcconnell_ky',
      name: 'KY Republican Party Establishment',
      type: 'organization',
      // McConnell\'s machine, now operating without him at the helm.
      // Still the most organized R apparatus in the state.
      baseLean: { D: -90, R: 82, G: -58, L: -15 },
      threshold: 72,
      ralliesGranted: 0
    },
    {
      id: 'ky_umwa_ky',
      name: 'United Mine Workers of America — KY District',
      type: 'organization',
      // Eastern KY coal country; UMWA has shifted R with its members
      // but still voices pro-worker economic populism.
      baseLean: { D: 28, R: 28, G: -15, L: 5 },
      threshold: 60,
      ralliesGranted: 0
    },
    {
      id: 'ky_ky_ed_assoc',
      name: 'Kentucky Education Association (KEA)',
      type: 'organization',
      // Teachers went on wildcat strikes in 2018; politically activated.
      // Most organized D-leaning group in a very R state.
      baseLean: { D: 80, R: -60, G: 20, L: -22 },
      threshold: 62,
      ralliesGranted: 0
    },
  ],

  // ── LOUISIANA ─────────────────────────────────────────────────
  LA: [
    {
      id: 'la_landry',
      name: 'Jeff Landry (LA Governor)',
      type: 'individual',
      // Former AG; culture-war R. Won 2023 outright in the jungle primary.
      // Replaced Dem John Bel Edwards; MAGA in the Deep South mold.
      baseLean: { D: -90, R: 88, G: -58, L: -12 },
      threshold: 78,
      ralliesGranted: 3
    },
    {
      id: 'la_kennedy',
      name: 'John Kennedy (LA Senator)',
      type: 'individual',
      // Former D who switched parties; folksy quips mask a hard-right record.
      // Enormously popular in LA; useful for any R with Southern ambitions.
      baseLean: { D: -88, R: 88, G: -55, L: -8 },
      threshold: 72,
      ralliesGranted: 2
    },
    {
      id: 'la_cassidy',
      name: 'Bill Cassidy (LA Senator)',
      type: 'individual',
      // One of 7 Rs who voted to convict Trump in 2021 impeachment trial.
      // His endorsement is the Never-Trump R signal in the Deep South.
      baseLean: { D: -28, R: 62, G: -25, L: 15 },
      threshold: 72,
      ralliesGranted: 2
    },
    {
      id: 'la_la_afl',
      name: 'Louisiana AFL-CIO',
      type: 'organization',
      // New Orleans port and construction trades. Smaller than Northern
      // affiliates but vital for Crescent City Dem turnout.
      baseLean: { D: 78, R: -52, G: 18, L: -18 },
      threshold: 62,
      ralliesGranted: 0
    },
    {
      id: 'la_oil_gas_la',
      name: 'Louisiana Mid-Continent Oil & Gas Association',
      type: 'organization',
      // Offshore drilling = lifeblood of southern LA economy.
      // Their opposition to a D candidate can be campaign-defining.
      baseLean: { D: -58, R: 82, G: -88, L: 20 },
      threshold: 65,
      ralliesGranted: 0
    },
  ],

  // ── MAINE ─────────────────────────────────────────────────────
  ME: [
    {
      id: 'me_collins',
      name: 'Susan Collins (ME Senator)',
      type: 'individual',
      // Most moderate R in the Senate; survived every wave election.
      // The single most coveted bipartisan endorsement in New England.
      // Extremely hard to get; endorses based on long relationships.
      baseLean: { D: -12, R: 62, G: -18, L: 20 },
      threshold: 85,
      ralliesGranted: 2
    },
    {
      id: 'me_king',
      name: 'Angus King (ME Senator, I)',
      type: 'individual',
      // True independent; caucuses with Ds but has genuine R relationships.
      // His endorsement is rare and signals broad-spectrum credibility.
      baseLean: { D: 35, R: 12, G: 15, L: 30 },
      threshold: 78,
      ralliesGranted: 2
    },
    {
      id: 'me_mills',
      name: 'Janet Mills (Former ME Governor)',
      type: 'individual',
      // Term-limited moderate D; won twice in a swing state.
      // Key for the ME-2 congressional district split-ticket dynamic.
      baseLean: { D: 75, R: -42, G: 10, L: -12 },
      threshold: 65,
      ralliesGranted: 2
    },
    {
      id: 'me_maine_afl',
      name: 'Maine AFL-CIO',
      type: 'organization',
      baseLean: { D: 78, R: -52, G: 20, L: -18 },
      threshold: 60,
      ralliesGranted: 0
    },
    {
      id: 'me_fishing_industry',
      name: 'Maine Lobstermen\'s Association',
      type: 'organization',
      // Lobster fishing is the iconic ME industry; their members have
      // moved R over whale protection and gear restrictions.
      baseLean: { D: -38, R: 65, G: -55, L: 12 },
      threshold: 58,
      ralliesGranted: 0
    },
  ],

  // ── MARYLAND ─────────────────────────────────────────────────
  MD: [
    {
      id: 'md_moore',
      name: 'Wes Moore (MD Governor)',
      type: 'individual',
      // First Black governor of MD; Rhodes Scholar + Army Ranger.
      // One of the most talked-about future D presidential candidates.
      // Getting his endorsement early is enormously valuable nationally.
      baseLean: { D: 90, R: -80, G: 18, L: -32 },
      threshold: 80,
      ralliesGranted: 4
    },
    {
      id: 'md_van_hollen',
      name: 'Chris Van Hollen (MD Senator)',
      type: 'individual',
      // Senate progressive on healthcare and foreign policy; DC suburbs base.
      baseLean: { D: 85, R: -80, G: 20, L: -30 },
      threshold: 65,
      ralliesGranted: 2
    },
    {
      id: 'md_hogan',
      name: 'Larry Hogan (Former MD Governor)',
      type: 'individual',
      // Two-term R governor in a deep-blue state; term-limited.
      // Lost 2024 Senate race. The Never-Trump R moderate brand.
      baseLean: { D: -18, R: 58, G: -15, L: 18 },
      threshold: 72,
      ralliesGranted: 2
    },
    {
      id: 'md_msea',
      name: 'Maryland State Education Association (MSEA)',
      type: 'organization',
      baseLean: { D: 85, R: -72, G: 22, L: -28 },
      threshold: 62,
      ralliesGranted: 0
    },
    {
      id: 'md_bmore_naacp',
      name: 'Baltimore City NAACP',
      type: 'organization',
      // Baltimore has one of the largest Black urban populations in the
      // country; their endorsement is a critical turnout signal for the city.
      baseLean: { D: 88, R: -85, G: 25, L: -20 },
      threshold: 65,
      ralliesGranted: 0
    },
  ],

  // ── MASSACHUSETTS ─────────────────────────────────────────────
  MA: [
    {
      id: 'ma_healey',
      name: 'Maura Healey (MA Governor)',
      type: 'individual',
      // First openly lesbian governor in US history; former AG.
      // A future presidential candidate; her endorsement is a signal
      // to LGBTQ+ donors and progressive women nationwide.
      baseLean: { D: 88, R: -82, G: 25, L: -25 },
      threshold: 75,
      ralliesGranted: 3
    },
    {
      id: 'ma_markey',
      name: 'Ed Markey (MA Senator)',
      type: 'individual',
      // Co-author of the Green New Deal; internet regulation veteran.
      // Essential for climate-focused progressive donors.
      baseLean: { D: 82, R: -88, G: 65, L: -25 },
      threshold: 68,
      ralliesGranted: 2
    },
    {
      id: 'ma_pressley',
      name: 'Ayanna Pressley (MA-7 Rep.)',
      type: 'individual',
      // Squad member; racial justice focus. Key for Boston\'s communities
      // of color and national progressive fundraising.
      baseLean: { D: 78, R: -95, G: 65, L: -35 },
      threshold: 72,
      ralliesGranted: 3
    },
    {
      id: 'ma_ma_afl',
      name: 'Massachusetts AFL-CIO',
      type: 'organization',
      baseLean: { D: 85, R: -65, G: 20, L: -28 },
      threshold: 65,
      ralliesGranted: 0
    },
    {
      id: 'ma_globe_editorial',
      name: 'Boston Globe Editorial Board',
      type: 'organization',
      // Most influential newspaper in New England. Their endorsements
      // carry regional weight in both MA and NH primaries.
      baseLean: { D: 68, R: -72, G: 15, L: 5 },
      threshold: 60,
      ralliesGranted: 0
    },
  ],

  // ── MISSOURI ─────────────────────────────────────────────────
  MO: [
    {
      id: 'mo_hawley',
      name: 'Josh Hawley (MO Senator)',
      type: 'individual',
      // Yale/Stanford populist who fist-pumped on Jan 6. Ideological
      // anchor for the nationalist-conservative wing. Very hard for
      // establishment Rs to get; harder still for Ds.
      baseLean: { D: -90, R: 80, G: -55, L: -15 },
      threshold: 82,
      ralliesGranted: 3
    },
    {
      id: 'mo_schmitt',
      name: 'Eric Schmitt (MO Senator)',
      type: 'individual',
      // Former AG who sued China over COVID. MAGA-adjacent but
      // less theatrical than Hawley.
      baseLean: { D: -85, R: 85, G: -52, L: -10 },
      threshold: 72,
      ralliesGranted: 2
    },
    {
      id: 'mo_kehoe',
      name: 'Mike Kehoe (MO Governor)',
      type: 'individual',
      // Successor to Parson; car dealer turned lieutenant governor.
      // Traditional MO R; endorsement is the state establishment seal.
      baseLean: { D: -80, R: 82, G: -50, L: -10 },
      threshold: 70,
      ralliesGranted: 2
    },
    {
      id: 'mo_mo_farm_bureau',
      name: 'Missouri Farm Bureau',
      type: 'organization',
      baseLean: { D: -28, R: 78, G: -48, L: 18 },
      threshold: 60,
      ralliesGranted: 0
    },
    {
      id: 'mo_teamsters_stlouis',
      name: 'Teamsters Joint Council 13 (St. Louis)',
      type: 'organization',
      // One of the largest Teamsters councils in the Midwest; genuine
      // swing between parties on economic issues.
      baseLean: { D: 18, R: 22, G: -5, L: 8 },
      threshold: 60,
      ralliesGranted: 0
    },
  ],

  // ── MISSISSIPPI ───────────────────────────────────────────────
  MS: [
    {
      id: 'ms_reeves',
      name: 'Tate Reeves (MS Governor)',
      type: 'individual',
      // Deep South R; tax-cut conservative. Signed the most restrictive
      // abortion law in America pre-Dobbs.
      baseLean: { D: -90, R: 88, G: -58, L: -15 },
      threshold: 78,
      ralliesGranted: 2
    },
    {
      id: 'ms_wicker',
      name: 'Roger Wicker (MS Senior Senator)',
      type: 'individual',
      // Armed Services Committee ranking member. Defense hawk; one of
      // the most experienced foreign-policy Rs in the Senate.
      baseLean: { D: -82, R: 82, G: -52, L: -10 },
      threshold: 70,
      ralliesGranted: 1
    },
    {
      id: 'ms_bennie_thompson',
      name: 'Bennie Thompson (MS-2 Rep.)',
      type: 'individual',
      // Jan 6 Committee chair; longest-serving D in MS. Essential for
      // the Mississippi Delta Black community\'s political mobilization.
      baseLean: { D: 88, R: -90, G: 20, L: -38 },
      threshold: 65,
      ralliesGranted: 2
    },
    {
      id: 'ms_ms_naacp',
      name: 'Mississippi State Conference of the NAACP',
      type: 'organization',
      // MS has the highest proportion of Black residents of any state.
      // Their endorsement is the key mobilizing signal for the state\'s Dems.
      baseLean: { D: 88, R: -85, G: 22, L: -22 },
      threshold: 65,
      ralliesGranted: 0
    },
    {
      id: 'ms_ms_econ_council',
      name: 'Mississippi Economic Council',
      type: 'organization',
      // State chamber of commerce; catfish, timber, and auto-parts economy.
      baseLean: { D: -32, R: 78, G: -48, L: 15 },
      threshold: 58,
      ralliesGranted: 0
    },
  ],

  // ── MONTANA ───────────────────────────────────────────────────
  MT: [
    {
      id: 'mt_tester',
      name: 'Jon Tester (Former MT Senator)',
      type: 'individual',
      // Three-term D senator from a Trump +16 state; lost 2024.
      // His organic-farmer, third-generation MT brand was the Dem
      // crossover blueprint. Retired but still respected statewide.
      baseLean: { D: 65, R: -18, G: 10, L: -5 },
      threshold: 62,
      ralliesGranted: 3
    },
    {
      id: 'mt_daines',
      name: 'Steve Daines (MT Senator)',
      type: 'individual',
      // NRSC chair; outdoorsman R. Trump ally but also pragmatic on
      // public lands. Key for any R seeking Mountain West credibility.
      baseLean: { D: -80, R: 85, G: -48, L: 5 },
      threshold: 72,
      ralliesGranted: 2
    },
    {
      id: 'mt_gianforte',
      name: 'Greg Gianforte (MT Governor)',
      type: 'individual',
      // Infamously body-slammed a reporter; won anyway. Tech millionaire
      // + MAGA; term-limited. His donor network is his main value.
      baseLean: { D: -82, R: 82, G: -52, L: -5 },
      threshold: 70,
      ralliesGranted: 2
    },
    {
      id: 'mt_mt_farm_bureau',
      name: 'Montana Farm Bureau',
      type: 'organization',
      // Wheat, cattle, and sugar beet. Trade-sensitive; key for eastern
      // MT plains counties.
      baseLean: { D: -30, R: 78, G: -48, L: 15 },
      threshold: 58,
      ralliesGranted: 0
    },
    {
      id: 'mt_mt_afl',
      name: 'Montana AFL-CIO',
      type: 'organization',
      // Smaller but punches above its weight in Billings and Great Falls.
      // Key for Tester-coalition working-class crossover voters.
      baseLean: { D: 72, R: -38, G: 18, L: -12 },
      threshold: 58,
      ralliesGranted: 0
    },
  ],

  // ── NEBRASKA ─────────────────────────────────────────────────
  NE: [
    {
      id: 'ne_fischer',
      name: 'Deb Fischer (NE Senior Senator)',
      type: 'individual',
      // Rancher-turned-senator; Armed Services. Traditional R.
      baseLean: { D: -80, R: 82, G: -50, L: -5 },
      threshold: 68,
      ralliesGranted: 1
    },
    {
      id: 'ne_ricketts',
      name: 'Pete Ricketts (NE Senator)',
      type: 'individual',
      // Chicago Cubs owner + governor + senator. One of the biggest
      // R donors in the country; his network is his endorsement\'s value.
      baseLean: { D: -80, R: 85, G: -52, L: -8 },
      threshold: 72,
      ralliesGranted: 2
    },
    {
      id: 'ne_pillen',
      name: 'Jim Pillen (NE Governor)',
      type: 'individual',
      // Hog farmer turned governor. Replaced Ricketts; MAGA-adjacent.
      baseLean: { D: -82, R: 82, G: -52, L: -8 },
      threshold: 70,
      ralliesGranted: 2
    },
    {
      id: 'ne_ne_farm_bureau',
      name: 'Nebraska Farm Bureau',
      type: 'organization',
      // Corn, soybeans, cattle. Trade policy is paramount.
      // Note: NE-2 (Omaha) is a swing congressional district worth an
      // electoral vote via Maine-Nebraska split.
      baseLean: { D: -28, R: 80, G: -50, L: 18 },
      threshold: 60,
      ralliesGranted: 0
    },
    {
      id: 'ne_omaha_chamber',
      name: 'Greater Omaha Chamber of Commerce',
      type: 'organization',
      // Omaha/NE-2 is the most competitive part of the state.
      // Warren Buffett\'s hometown; tech + finance + insurance economy.
      baseLean: { D: -8, R: 55, G: -35, L: 22 },
      threshold: 55,
      ralliesGranted: 0
    },
  ],

  // ── NEW MEXICO ─────────────────────────────────────────────────
  NM: [
    {
      id: 'nm_lujan_grisham',
      name: 'Michelle Lujan Grisham (NM Governor)',
      type: 'individual',
      // Two-term D governor in a state with the highest Hispanic percentage
      // of any state. Key for D Latino strategy.
      baseLean: { D: 85, R: -75, G: 15, L: -28 },
      threshold: 68,
      ralliesGranted: 3
    },
    {
      id: 'nm_heinrich',
      name: 'Martin Heinrich (NM Senator)',
      type: 'individual',
      // Energy/climate expert; engineer background. Strong with
      // NM tech + DOE/Sandia Labs community.
      baseLean: { D: 82, R: -70, G: 25, L: -18 },
      threshold: 62,
      ralliesGranted: 2
    },
    {
      id: 'nm_lujan',
      name: 'Ben Ray Luján (NM Senator)',
      type: 'individual',
      // Former DCCC chair; key for national D infrastructure.
      // NM Hispanic community anchor.
      baseLean: { D: 85, R: -72, G: 18, L: -25 },
      threshold: 62,
      ralliesGranted: 2
    },
    {
      id: 'nm_nm_afl',
      name: 'New Mexico Federation of Labor (AFL-CIO)',
      type: 'organization',
      baseLean: { D: 80, R: -55, G: 18, L: -20 },
      threshold: 60,
      ralliesGranted: 0
    },
    {
      id: 'nm_chci',
      name: 'Congressional Hispanic Caucus Institute (NM Chapter)',
      type: 'organization',
      // NM is majority-minority; Latino mobilization orgs like this
      // are the key to turnout in Bernalillo (Albuquerque) + Doña Ana.
      baseLean: { D: 85, R: -72, G: 22, L: -18 },
      threshold: 62,
      ralliesGranted: 0
    },
  ],

  // ── NORTH DAKOTA ─────────────────────────────────────────────
  ND: [
    {
      id: 'nd_burgum',
      name: 'Doug Burgum (Former ND Governor)',
      type: 'individual',
      // Brief 2024 presidential candidate; tech entrepreneur + rancher.
      // Now serving in Trump cabinet. His R endorsement carries weight
      // in the Northern Plains business community.
      baseLean: { D: -72, R: 82, G: -48, L: 10 },
      threshold: 70,
      ralliesGranted: 2
    },
    {
      id: 'nd_cramer',
      name: 'Kevin Cramer (ND Senator)',
      type: 'individual',
      // Energy policy hawk; key for Bakken oil patch voters.
      baseLean: { D: -82, R: 85, G: -55, L: -8 },
      threshold: 68,
      ralliesGranted: 1
    },
    {
      id: 'nd_hoeven',
      name: 'John Hoeven (ND Senior Senator)',
      type: 'individual',
      // Former governor; most senior ND politician. Ag + energy focus.
      baseLean: { D: -78, R: 82, G: -50, L: -5 },
      threshold: 65,
      ralliesGranted: 1
    },
    {
      id: 'nd_nd_farm_bureau',
      name: 'North Dakota Farm Bureau',
      type: 'organization',
      // Wheat, sunflower, canola. The agricultural center of gravity
      // in a state where farming is the economy.
      baseLean: { D: -30, R: 82, G: -52, L: 18 },
      threshold: 58,
      ralliesGranted: 0
    },
    {
      id: 'nd_standing_rock',
      name: 'Standing Rock Sioux Tribe',
      type: 'organization',
      // Dakota Access Pipeline protests made them a national symbol.
      // Their endorsement activates Indigenous voters across the Northern Plains.
      baseLean: { D: 65, R: -62, G: 55, L: 5 },
      threshold: 65,
      ralliesGranted: 0
    },
  ],

  // ── OKLAHOMA ─────────────────────────────────────────────────
  OK: [
    {
      id: 'ok_stitt',
      name: 'Kevin Stitt (OK Governor)',
      type: 'individual',
      // Enrolled Cherokee Nation citizen + MAGA R governor. In repeated
      // conflict with tribal nations over gaming compacts.
      baseLean: { D: -88, R: 85, G: -55, L: -10 },
      threshold: 72,
      ralliesGranted: 2
    },
    {
      id: 'ok_lankford',
      name: 'James Lankford (OK Senator)',
      type: 'individual',
      // Former Baptist camp director; theocratic conservative.
      // Authored 2024 border deal then killed it under Trump pressure.
      baseLean: { D: -88, R: 82, G: -55, L: -15 },
      threshold: 72,
      ralliesGranted: 2
    },
    {
      id: 'ok_mullin',
      name: 'Markwayne Mullin (OK Senator)',
      type: 'individual',
      // Former MMA fighter turned senator; tried to fight a union boss
      // at a Senate hearing. Pure MAGA working-class brand.
      baseLean: { D: -90, R: 88, G: -58, L: -10 },
      threshold: 72,
      ralliesGranted: 3
    },
    {
      id: 'ok_cherokee_nation',
      name: 'Cherokee Nation',
      type: 'organization',
      // Largest tribal nation by population in the US (400k+).
      // Their political arm endorses strategically; key for eastern OK.
      baseLean: { D: 60, R: -38, G: 25, L: 5 },
      threshold: 65,
      ralliesGranted: 0
    },
    {
      id: 'ok_ok_farm_bureau',
      name: 'Oklahoma Farm Bureau',
      type: 'organization',
      baseLean: { D: -32, R: 80, G: -50, L: 18 },
      threshold: 58,
      ralliesGranted: 0
    },
  ],

  // ── OREGON ───────────────────────────────────────────────────
  OR: [
    {
      id: 'or_kotek',
      name: 'Tina Kotek (OR Governor)',
      type: 'individual',
      // First openly lesbian governor in OR; former House Speaker.
      // Won in 2022 when R spoiler nearly handed it to a D-turned-I candidate.
      baseLean: { D: 85, R: -78, G: 25, L: -22 },
      threshold: 68,
      ralliesGranted: 3
    },
    {
      id: 'or_merkley',
      name: 'Jeff Merkley (OR Senator)',
      type: 'individual',
      // The only senator who endorsed Sanders in 2016. Progressive labor
      // champion; very strong with OR environmental and union base.
      baseLean: { D: 85, R: -82, G: 40, L: -25 },
      threshold: 68,
      ralliesGranted: 2
    },
    {
      id: 'or_wyden',
      name: 'Ron Wyden (OR Senator)',
      type: 'individual',
      // Senate Finance Committee ranking member; healthcare expert.
      // Long-distance cyclist; beloved in OR for constituent services.
      baseLean: { D: 82, R: -72, G: 28, L: -15 },
      threshold: 62,
      ralliesGranted: 2
    },
    {
      id: 'or_or_afl',
      name: 'Oregon AFL-CIO',
      type: 'organization',
      baseLean: { D: 82, R: -60, G: 25, L: -20 },
      threshold: 62,
      ralliesGranted: 0
    },
    {
      id: 'or_sierra_or',
      name: 'Sierra Club Oregon Chapter',
      type: 'organization',
      // Timber vs. spotted owl legacy; now tech + outdoor recreation economy.
      // Highly activated by wildfire and climate.
      baseLean: { D: 72, R: -82, G: 88, L: -5 },
      threshold: 60,
      ralliesGranted: 0
    },
  ],

  // ── RHODE ISLAND ─────────────────────────────────────────────
  RI: [
    {
      id: 'ri_reed',
      name: 'Jack Reed (RI Senator)',
      type: 'individual',
      // Armed Services Committee ranking member; West Point + Harvard Law.
      // Most respected defense D in the Senate; bipartisan credibility.
      baseLean: { D: 82, R: -52, G: 12, L: -18 },
      threshold: 65,
      ralliesGranted: 2
    },
    {
      id: 'ri_whitehouse',
      name: 'Sheldon Whitehouse (RI Senator)',
      type: 'individual',
      // Climate + Supreme Court accountability crusader.
      // Key endorsement for progressive donors and environmentalists.
      baseLean: { D: 85, R: -80, G: 40, L: -25 },
      threshold: 65,
      ralliesGranted: 2
    },
    {
      id: 'ri_mckenney',
      name: 'Dan McKee (Former RI Governor)',
      type: 'individual',
      // Replaced Gina Raimondo (Biden cabinet); lost 2022 primary.
      // Endorsement carries Providence machine politics weight.
      baseLean: { D: 75, R: -60, G: 10, L: -20 },
      threshold: 55,
      ralliesGranted: 1
    },
    {
      id: 'ri_ri_afl',
      name: 'Rhode Island AFL-CIO',
      type: 'organization',
      // Providence-area manufacturing and construction trades.
      baseLean: { D: 82, R: -58, G: 18, L: -22 },
      threshold: 58,
      ralliesGranted: 0
    },
  ],

  // ── SOUTH DAKOTA ─────────────────────────────────────────────
  SD: [
    {
      id: 'sd_thune',
      name: 'John Thune (SD Senator / Senate Majority Leader)',
      type: 'individual',
      // New Senate Majority Leader post-McConnell era. Traditional R;
      // no-drama institutionalist. His endorsement is the institutional
      // R establishment signal, now even more powerful than before.
      baseLean: { D: -78, R: 88, G: -52, L: -8 },
      threshold: 80,
      ralliesGranted: 2
    },
    {
      id: 'sd_noem',
      name: 'Kristi Noem (Former SD Governor)',
      type: 'individual',
      // Dog-book controversy damaged her nationally but she retains
      // a significant MAGA base, especially among conservative women.
      baseLean: { D: -88, R: 75, G: -55, L: -12 },
      threshold: 70,
      ralliesGranted: 3
    },
    {
      id: 'sd_rounds',
      name: 'Mike Rounds (SD Senator)',
      type: 'individual',
      // Former governor; pragmatic R. One of few Rs to call Biden\'s
      // 2020 election legitimate early on.
      baseLean: { D: -65, R: 80, G: -45, L: -5 },
      threshold: 65,
      ralliesGranted: 1
    },
    {
      id: 'sd_sd_farm_bureau',
      name: 'South Dakota Farm Bureau',
      type: 'organization',
      // Corn, soybeans, cattle. Trade with China is existential for SD farmers.
      baseLean: { D: -28, R: 80, G: -50, L: 18 },
      threshold: 58,
      ralliesGranted: 0
    },
    {
      id: 'sd_oglala_sioux',
      name: 'Oglala Sioux Tribe (Pine Ridge)',
      type: 'organization',
      // One of the largest reservations in the US; deeply impoverished.
      // Their endorsement signals policy credibility with Indigenous voters
      // across the Northern Plains.
      baseLean: { D: 65, R: -65, G: 52, L: 5 },
      threshold: 62,
      ralliesGranted: 0
    },
  ],

  // ── TENNESSEE ─────────────────────────────────────────────────
  TN: [
    {
      id: 'tn_blackburn',
      name: 'Marsha Blackburn (TN Senator)',
      type: 'individual',
      // Hardcore MAGA; culture-war R. TikTok ban crusader and social
      // media provocateur. Big with TN evangelical base.
      baseLean: { D: -92, R: 88, G: -58, L: -15 },
      threshold: 75,
      ralliesGranted: 2
    },
    {
      id: 'tn_hagerty',
      name: 'Bill Hagerty (TN Senator)',
      type: 'individual',
      // Former Japan ambassador; private equity + MAGA. Foreign policy
      // + business community credibility.
      baseLean: { D: -82, R: 85, G: -52, L: -8 },
      threshold: 70,
      ralliesGranted: 2
    },
    {
      id: 'tn_lee',
      name: 'Bill Lee (TN Governor)',
      type: 'individual',
      // Businessman + evangelical; signed permitless carry law.
      // Traditional Southern R with a gospel music persona.
      baseLean: { D: -82, R: 85, G: -52, L: -8 },
      threshold: 70,
      ralliesGranted: 2
    },
    {
      id: 'tn_nashville_chamber',
      name: 'Nashville Area Chamber of Commerce',
      type: 'organization',
      // Nashville\'s tech and healthcare boom created a new business class
      // more moderate than the rest of TN. Oracle, Amazon HQ2-adjacent.
      baseLean: { D: -8, R: 58, G: -35, L: 25 },
      threshold: 55,
      ralliesGranted: 0
    },
    {
      id: 'tn_tn_afl',
      name: 'Tennessee AFL-CIO',
      type: 'organization',
      // Right-to-work state; small but significant in auto plant corridors
      // (Volkswagen Chattanooga, GM Spring Hill).
      baseLean: { D: 75, R: -50, G: 18, L: -18 },
      threshold: 60,
      ralliesGranted: 0
    },
  ],

  // ── UTAH ─────────────────────────────────────────────────────
  UT: [
    {
      id: 'ut_cox',
      name: 'Spencer Cox (UT Governor)',
      type: 'individual',
      // Anti-bullying, pro-civility R governor; one of the most
      // interesting moderate figures in the GOP. Reached out to
      // his D opponent post-election; genuine goodwill signal.
      baseLean: { D: -25, R: 72, G: -20, L: 15 },
      threshold: 72,
      ralliesGranted: 2
    },
    {
      id: 'ut_lee',
      name: 'Mike Lee (UT Senator)',
      type: 'individual',
      // Constitutionalist + libertarian-adjacent. Anti-establishment R
      // who briefly tried to block Trump\'s 2020 win then backpedaled.
      // His endorsement matters with the liberty-conservative wing.
      baseLean: { D: -72, R: 72, G: -38, L: 55 },
      threshold: 78,
      ralliesGranted: 2
    },
    {
      id: 'ut_lds_influence',
      name: 'Utah Eagle Forum (LDS Conservative Network)',
      type: 'organization',
      // The LDS Church\'s political footprint is enormous in UT.
      // This org represents the institutional conservative Mormon voter.
      // In 2028, the Trump-Romney schism still echoes here.
      baseLean: { D: -65, R: 78, G: -42, L: 15 },
      threshold: 70,
      ralliesGranted: 0
    },
    {
      id: 'ut_silicon_slopes',
      name: 'Silicon Slopes Tech Alliance',
      type: 'organization',
      // Utah\'s booming tech economy (Qualtrics, Domo, Pluralsight area).
      // Libertarian-leaning; fiscally R but socially more moderate.
      baseLean: { D: 5, R: 48, G: -12, L: 48 },
      threshold: 58,
      ralliesGranted: 0
    },
    {
      id: 'ut_ut_farm_bureau',
      name: 'Utah Farm Bureau',
      type: 'organization',
      baseLean: { D: -32, R: 80, G: -50, L: 15 },
      threshold: 55,
      ralliesGranted: 0
    },
  ],

  // ── VERMONT ───────────────────────────────────────────────────
  VT: [
    {
      id: 'vt_scott',
      name: 'Phil Scott (VT Governor)',
      type: 'individual',
      // The most popular governor in America repeatedly; NASCAR driver
      // + R in a D+35 state. His bipartisan appeal is uniquely authentic.
      // The ultimate crossover endorsement in New England.
      baseLean: { D: 12, R: 68, G: 5, L: 28 },
      threshold: 82,
      ralliesGranted: 3
    },
    {
      id: 'vt_welch',
      name: 'Peter Welch (VT Senator)',
      type: 'individual',
      // Replaced Leahy; Bernie-adjacent progressive. Low-key but
      // reliable D signal.
      baseLean: { D: 82, R: -78, G: 40, L: -20 },
      threshold: 60,
      ralliesGranted: 2
    },
    {
      id: 'vt_vt_afl',
      name: 'Vermont AFL-CIO',
      type: 'organization',
      baseLean: { D: 80, R: -55, G: 28, L: -18 },
      threshold: 58,
      ralliesGranted: 0
    },
    {
      id: 'vt_vt_farmers_market',
      name: 'Vermont Fresh Network / Farm & Food Alliance',
      type: 'organization',
      // Small-scale agriculture and farm-to-table economy; deeply
      // progressive. Bernie\'s base in rural VT.
      baseLean: { D: 65, R: -55, G: 80, L: 5 },
      threshold: 55,
      ralliesGranted: 0
    },
  ],

  // ── WASHINGTON ───────────────────────────────────────────────
  WA: [
    {
      id: 'wa_ferguson',
      name: 'Bob Ferguson (WA Governor)',
      type: 'individual',
      // Former AG who sued Trump admin 30+ times. Won 2024 governor race.
      // National progressive credibility; strong climate + tech policy record.
      baseLean: { D: 88, R: -80, G: 28, L: -22 },
      threshold: 72,
      ralliesGranted: 3
    },
    {
      id: 'wa_murray',
      name: 'Patty Murray (WA Senior Senator)',
      type: 'individual',
      // The longest-serving woman in Senate history. Budget Committee
      // veteran; her endorsement signals the D appropriations network.
      baseLean: { D: 85, R: -75, G: 20, L: -28 },
      threshold: 65,
      ralliesGranted: 2
    },
    {
      id: 'wa_cantwell',
      name: 'Maria Cantwell (WA Senator)',
      type: 'individual',
      // Commerce Committee ranking member; tech + trade expert.
      // Amazon, Boeing, Microsoft economy means her endorsement carries
      // enormous weight with the Pacific NW tech business community.
      baseLean: { D: 82, R: -68, G: 18, L: 5 },
      threshold: 65,
      ralliesGranted: 2
    },
    {
      id: 'wa_wa_labor_council',
      name: 'Washington State Labor Council (AFL-CIO)',
      type: 'organization',
      // Boeing machinists, SEIU, longshore workers. One of the most
      // politically active state labor councils in the country.
      baseLean: { D: 85, R: -62, G: 25, L: -22 },
      threshold: 65,
      ralliesGranted: 0
    },
    {
      id: 'wa_tech_alliance',
      name: 'Washington Technology Industry Association',
      type: 'organization',
      // Microsoft, Amazon, Boeing HQ. Libertarian-leaning on regulation;
      // D-leaning on social issues. The quintessential tech-sector endorsement.
      baseLean: { D: 35, R: 20, G: 12, L: 42 },
      threshold: 60,
      ralliesGranted: 0
    },
  ],

  // ── WEST VIRGINIA ─────────────────────────────────────────────
  WV: [
    {
      id: 'wv_justice',
      name: 'Jim Justice (WV Senator)',
      type: 'individual',
      // Billionaire coal/resort owner; switched from D to R in 2017
      // at a Trump rally. Won 2024 Senate seat. MAGA-aligned populist.
      baseLean: { D: -82, R: 85, G: -52, L: -8 },
      threshold: 70,
      ralliesGranted: 2
    },
    {
      id: 'wv_morrisey',
      name: 'Patrick Morrisey (WV Governor)',
      type: 'individual',
      // Former AG; won 2024 governor race replacing Justice.
      // Opioid crisis attorney-turned-politician.
      baseLean: { D: -80, R: 82, G: -50, L: -8 },
      threshold: 68,
      ralliesGranted: 2
    },
    {
      id: 'wv_manchin',
      name: 'Joe Manchin (Former WV Senator)',
      type: 'individual',
      // The last rural D senator in a Trump+39 state; retired 2024.
      // His crossover endorsement, if obtainable, is the ultimate
      // working-class white D signal. Extremely hard to get.
      baseLean: { D: 48, R: 22, G: -8, L: 5 },
      threshold: 80,
      ralliesGranted: 3
    },
    {
      id: 'wv_umwa',
      name: 'United Mine Workers of America (UMWA) National HQ',
      type: 'organization',
      // HQ\'d in WV. Their endorsement history is fascinating — they\'ve
      // backed Ds historically but membership has shifted R.
      // Genuinely bipartisan on economic populism; swingable with the
      // right energy transition message.
      baseLean: { D: 28, R: 30, G: -20, L: 5 },
      threshold: 65,
      ralliesGranted: 0
    },
    {
      id: 'wv_wv_chamber',
      name: 'West Virginia Chamber of Commerce',
      type: 'organization',
      // Coal and chemical industry business lobby.
      baseLean: { D: -38, R: 80, G: -60, L: 15 },
      threshold: 58,
      ralliesGranted: 0
    },
  ],

  // ── WYOMING ───────────────────────────────────────────────────
  WY: [
    {
      id: 'wy_barrasso',
      name: 'John Barrasso (WY Senior Senator / Senate Republican Whip)',
      type: 'individual',
      // Senate R Whip; orthopedic surgeon + oil-state conservative.
      // His endorsement signals the Senate R leadership\'s blessing.
      baseLean: { D: -82, R: 88, G: -55, L: -8 },
      threshold: 75,
      ralliesGranted: 2
    },
    {
      id: 'wy_lummis',
      name: 'Cynthia Lummis (WY Senator)',
      type: 'individual',
      // Most crypto-friendly senator in the country; rancher background.
      // Key endorsement for any R trying to lock down the libertarian-tech wing.
      baseLean: { D: -80, R: 82, G: -45, L: 35 },
      threshold: 70,
      ralliesGranted: 2
    },
    {
      id: 'wy_gordon',
      name: 'Mark Gordon (WY Governor)',
      type: 'individual',
      // Traditional rancher-class R; more institutionalist than MAGA.
      baseLean: { D: -78, R: 82, G: -50, L: -5 },
      threshold: 68,
      ralliesGranted: 1
    },
    {
      id: 'wy_stock_growers',
      name: 'Wyoming Stock Growers Association',
      type: 'organization',
      // The oldest and most powerful political organization in WY.
      // Cattle ranching + public lands access = key issues.
      baseLean: { D: -38, R: 85, G: -55, L: 18 },
      threshold: 60,
      ralliesGranted: 0
    },
    {
      id: 'wy_energy_assoc',
      name: 'Wyoming Energy Authority / Petroleum Association',
      type: 'organization',
      // Coal, natural gas, and oil; WY is the most energy-intensive
      // state per capita. Their opposition to a D can be campaign-defining.
      baseLean: { D: -60, R: 85, G: -90, L: 18 },
      threshold: 62,
      ralliesGranted: 0
    },
  ],

}; // end remainingStates

Object.assign(endorserDB.states, remainingStates);

