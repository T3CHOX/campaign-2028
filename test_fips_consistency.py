#!/usr/bin/env python3
"""
Test script to verify FIPS code handling is consistent across the game
"""
import json
from pathlib import Path

def main():
    # Load county data
    county_data_path = Path('/home/runner/work/campaign-2028/campaign-2028/counties/county_data.json')
    with open(county_data_path, 'r') as f:
        county_data = json.load(f)
    
    print("=" * 60)
    print("FIPS CODE CONSISTENCY TEST")
    print("=" * 60)
    
    # Test 1: Check for leading zeros in county_data.json keys
    print("\n1. Checking county_data.json FIPS format...")
    leading_zero_count = 0
    sample_fips = []
    
    for fips in county_data.keys():
        if fips.startswith('0'):
            leading_zero_count += 1
            if len(sample_fips) < 5:
                sample_fips.append(fips)
    
    if leading_zero_count == 0:
        print("   ✓ All FIPS codes have leading zeros stripped")
    else:
        print(f"   ✗ Found {leading_zero_count} FIPS codes with leading zeros")
        print(f"   Samples: {sample_fips}")
    
    # Test 2: Verify Arizona counties exist
    print("\n2. Checking Arizona counties (FIPS 04xxx)...")
    arizona_counties = {k: v for k, v in county_data.items() if k.startswith('4') and len(k) == 4}
    
    if len(arizona_counties) > 0:
        print(f"   ✓ Found {len(arizona_counties)} Arizona counties")
        for fips, county in list(arizona_counties.items())[:3]:
            print(f"      {fips}: {county['n']}")
    else:
        print("   ✗ No Arizona counties found!")
    
    # Test 3: Check demographics structure
    print("\n3. Checking demographics structure...")
    counties_with_demographics = 0
    sample_demographics = []
    
    for fips, county in county_data.items():
        if 'demographics' in county:
            counties_with_demographics += 1
            if len(sample_demographics) < 3:
                sample_demographics.append({
                    'fips': fips,
                    'name': county['n'],
                    'demographics': county['demographics']
                })
    
    print(f"   Counties with demographics: {counties_with_demographics}/{len(county_data)}")
    if sample_demographics:
        print("   Sample demographics:")
        for sample in sample_demographics:
            demo = sample['demographics']
            print(f"      {sample['fips']} ({sample['name']}): female={demo.get('female', 'N/A')}, college={demo.get('college', 'N/A')}, hs_grad={demo.get('hs_grad', 'N/A')}")
    
    # Test 4: Verify county structure
    print("\n4. Verifying required county fields...")
    required_fields = ['n', 't', 'p', 'v']
    optional_fields = ['demographics', 'undecided']
    
    sample_county = next(iter(county_data.items()))
    fips, county = sample_county
    
    print(f"   Testing county: {fips} ({county.get('n', 'unknown')})")
    for field in required_fields:
        if field in county:
            print(f"      ✓ {field}: {county[field]}")
        else:
            print(f"      ✗ Missing required field: {field}")
    
    for field in optional_fields:
        if field in county:
            print(f"      + {field}: {county[field]}")
    
    # Test 5: Check FIPS padding logic
    print("\n5. Testing FIPS padding for SVG IDs...")
    test_cases = [
        ('1001', '01001'),   # Alabama
        ('4013', '04013'),   # Arizona - Maricopa
        ('10001', '10001'),  # Delaware
    ]
    
    all_passed = True
    for fips, expected_padded in test_cases:
        padded = fips.zfill(5)
        svg_id = 'c' + padded
        if padded == expected_padded:
            print(f"   ✓ {fips} → {padded} → SVG ID: {svg_id}")
        else:
            print(f"   ✗ {fips} → {padded} (expected: {expected_padded})")
            all_passed = False
    
    # Test 6: State grouping
    print("\n6. Grouping counties by state...")
    state_groups = {}
    for fips in county_data.keys():
        # Pad to 5 digits to get state FIPS
        padded = fips.zfill(5)
        state_fips = padded[:2]
        
        if state_fips not in state_groups:
            state_groups[state_fips] = []
        state_groups[state_fips].append(fips)
    
    # Show early states that might have issues
    early_states = ['01', '02', '04', '05', '06']
    for state_fips in early_states:
        if state_fips in state_groups:
            counties = state_groups[state_fips]
            state_names = {
                '01': 'Alabama',
                '02': 'Alaska', 
                '04': 'Arizona',
                '05': 'Arkansas',
                '06': 'California'
            }
            print(f"   State {state_fips} ({state_names[state_fips]}): {len(counties)} counties")
    
    print("\n" + "=" * 60)
    print("TEST COMPLETE")
    print("=" * 60)
    
    # Summary
    print("\nSummary:")
    print(f"  - Total counties: {len(county_data)}")
    print(f"  - Counties with demographics: {counties_with_demographics}")
    print(f"  - Arizona counties: {len(arizona_counties)}")
    print(f"  - FIPS codes with leading zeros: {leading_zero_count}")

if __name__ == "__main__":
    main()
