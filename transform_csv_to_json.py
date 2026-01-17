#!/usr/bin/env python3
"""
Transform demographic CSV data into county_data.json format
"""
import json
import csv
import sys
from pathlib import Path

def strip_leading_zeros(fips_str):
    """Strip leading zeros from FIPS code string"""
    # Convert to int then back to string to remove leading zeros
    return str(int(fips_str))

def calculate_county_type(rural_percent):
    """
    Calculate county type based on rural percentage
    - Rural if > 0.5 (50%)
    - Urban if < 0.1 (10%)
    - Suburb otherwise
    """
    if rural_percent > 0.5:
        return "Rural"
    elif rural_percent < 0.1:
        return "Urban"
    else:
        return "Suburb"

def transform_csv_to_json(csv_path, existing_json_path, output_path):
    """
    Transform CSV data and merge with existing county data
    """
    # Load existing county data
    print(f"Loading existing county data from {existing_json_path}...")
    with open(existing_json_path, 'r') as f:
        county_data = json.load(f)
    
    print(f"Found {len(county_data)} existing counties")
    
    # Read CSV and update county data
    print(f"Reading CSV from {csv_path}...")
    updates_count = 0
    new_counties = 0
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            try:
                # Extract and transform FIPS code
                raw_fips = row['5-digit FIPS Code'].strip()
                fips = strip_leading_zeros(raw_fips)
                
                # Extract data
                name = row['Name'].strip()
                population = int(float(row['Population raw value']))
                rural_percent = float(row['% Rural raw value'])
                female_percent = float(row['% Female raw value'])
                hs_completion = float(row['High School Completion raw value'])
                some_college = float(row['Some College raw value'])
                
                # Calculate county type
                county_type = calculate_county_type(rural_percent)
                
                # Create or update county entry
                if fips not in county_data:
                    # New county - create with placeholder vote data
                    county_data[fips] = {
                        "n": name,
                        "t": county_type,
                        "p": population,
                        "demographics": {
                            "female": round(female_percent, 3),
                            "college": round(some_college, 3),
                            "hs_grad": round(hs_completion, 3)
                        },
                        "v": {"D": 0, "R": 0, "G": 0, "L": 0, "O": 0},
                        "undecided": 15.0
                    }
                    new_counties += 1
                else:
                    # Update existing county
                    county_data[fips]["t"] = county_type
                    county_data[fips]["p"] = population
                    county_data[fips]["demographics"] = {
                        "female": round(female_percent, 3),
                        "college": round(some_college, 3),
                        "hs_grad": round(hs_completion, 3)
                    }
                    updates_count += 1
                
            except KeyError as e:
                print(f"Warning: Missing column {e} in row: {row.get('Name', 'unknown')}")
                continue
            except ValueError as e:
                print(f"Warning: Invalid value in row {row.get('Name', 'unknown')}: {e}")
                continue
    
    print(f"\nUpdated {updates_count} existing counties")
    print(f"Added {new_counties} new counties")
    print(f"Total counties: {len(county_data)}")
    
    # Write output
    print(f"\nWriting output to {output_path}...")
    with open(output_path, 'w') as f:
        json.dump(county_data, f, separators=(',', ':'))
    
    print("✓ Transformation complete!")
    return county_data

def main():
    # File paths
    csv_path = Path('/home/runner/work/campaign-2028/campaign-2028/analytic_data2025_v3.csv')
    existing_json = Path('/home/runner/work/campaign-2028/campaign-2028/counties/county_data.json')
    output_path = Path('/home/runner/work/campaign-2028/campaign-2028/counties/county_data.json')
    
    # Check if CSV exists
    if not csv_path.exists():
        print(f"Error: CSV file not found at {csv_path}")
        print("Please ensure analytic_data2025_v3.csv is in the repository root")
        sys.exit(1)
    
    # Transform data
    transform_csv_to_json(csv_path, existing_json, output_path)

if __name__ == "__main__":
    main()
