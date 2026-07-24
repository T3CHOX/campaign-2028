import pandas as pd
import json
import os
import math

def process_economy_data():
    excel_path = r'C:\Users\quavo\Downloads\2023_Feeding_the_Economy_County_Data-USA.xlsx'
    js_output_path = r'C:\Users\quavo\Downloads\campaign-2028-main\campaign-2028-main\js\county_economy.js'

    print("Reading Excel file...")
    # The data is on the first sheet, starting from row 0.
    df = pd.read_excel(excel_path)
    
    economy_data = {}
    
    print("Processing rows...")
    for idx, row in df.iterrows():
        try:
            # county code might be '1419964' - we need standard FIPS.
            # In the user's data, county code is `county code` (numeric or string)
            # The game uses 5 digit FIPS strings.
            # However, looking at the previous dump, 'county code' seems to be a weird 7 digit number for some, like 1419964. Wait! 
            # 1419964 for ALEUTIANS EAST AK? FIPS is 02013 for Aleutians East.
            # Let's check how many digits it is. The state is 'AK'.
            # Maybe there's a better column, or maybe 'county code' is not FIPS?
            # If it's not FIPS, we can match on 'County' and 'State'.
            # The game has STATES map with abbreviations.
            county_name = str(row.get('County', '')).upper()
            state_code = str(row.get('State', '')).upper()
            total_jobs = pd.to_numeric(row.get('Total Jobs', 0), errors='coerce')
            agri_jobs = pd.to_numeric(row.get('Agriculture Jobs', 0), errors='coerce')
            mfg_jobs = pd.to_numeric(row.get('Manufacturing Jobs', 0), errors='coerce')
            
            # Direct Output
            agri_output = pd.to_numeric(row.get('Agriculture Output', 0), errors='coerce')
            mfg_output = pd.to_numeric(row.get('Manufacturing Output', 0), errors='coerce')
            total_output = pd.to_numeric(row.get('Total Output', 0), errors='coerce')

            if pd.isna(total_jobs) or total_jobs == 0:
                continue
                
            # Create a simple ratio
            agri_index = (agri_jobs / total_jobs) if total_jobs > 0 else 0
            mfg_index = (mfg_jobs / total_jobs) if total_jobs > 0 else 0
            
            if total_output > 0:
                agri_output_ratio = agri_output / total_output
                mfg_output_ratio = mfg_output / total_output
                agri_index = (agri_index + agri_output_ratio) / 2
                mfg_index = (mfg_index + mfg_output_ratio) / 2
            
            key = f"{county_name}_{state_code}"
            
            economy_data[key] = {
                "agri_index": round(agri_index, 4),
                "mfg_index": round(mfg_index, 4)
            }
        except Exception as e:
            print(f"Error on row {idx}: {e}")
            
    print(f"Processed {len(economy_data)} counties.")
    
    # We will write this as a JS object mapping to County_State format, 
    # since mapping to FIPS might be difficult if we don't have FIPS in the excel sheet.
    # The game can resolve County_State to FIPS on startup.
    js_content = "/* AUTO-GENERATED from 2023_Feeding_the_Economy_County_Data-USA.xlsx */\n\n"
    js_content += "const RAW_COUNTY_ECONOMY = " + json.dumps(economy_data, indent=2) + ";\n"
    
    with open(js_output_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"Wrote data to {js_output_path}")

if __name__ == "__main__":
    process_economy_data()
