import pandas as pd
import requests
import json
import time
from requests.auth import HTTPBasicAuth

# === Config ===
WETRACK_EXCEL_PATH = 'wetrack_data.xlsx'
OUTPUT_REPORT_PATH = 'marley_wetrack_comparison_report.xlsx'
API_BASE_URL = 'https://asset/api/v2/hardware/desktop/'
USERNAME = 'gsc_dws_usu_wt'
PASSWORD = 'your_password_here'
CACERT_PATH = '/path/to/cacert.pem'

# === Marley Status to Expected Wetrack Status Mapping ===
expected_mapping = {
    ("Active", "In Use"): "Allocated",
    ("To be reused", "Unused"): "Stock",
    ("Given to technical teams", "Unused"): "Store to Proximit",
    ("To Check", "Unused"): "Investigation",
    ("To be destroyed", "Unused"): "Ewaste"
}

# === Load Wetrack Excel File ===
wetrack_df = pd.read_excel(WETRACK_EXCEL_PATH)

# === Output Collector ===
marley_results = []

# === Loop Through Wetrack Rows ===
for index, row in wetrack_df.iterrows():
    asset_id = str(row.get('asset_id', '')).strip()
    wetrack_igg = str(row.get('igg', '')).strip()
    wetrack_status = str(row.get('wetrack_status', '')).strip()
    wetrack_serial = str(row.get('serial_number', '')).strip()

    marley_igg = marley_status = marley_serial = user_name = match_result = ""

    try:
        # === Sleep after every 5 requests ===
        if index > 0 and index % 5 == 0:
            print("⏳ Sleeping for 3 minutes after 5 requests...")
            time.sleep(180)

        # === API Request ===
        response = requests.get(
            API_BASE_URL + asset_id,
            verify=CACERT_PATH,
            auth=HTTPBasicAuth(USERNAME, PASSWORD)
        )
        data = json.loads(response.text)

        marley_serial = str(data.get('fixed', {}).get('serial_number', '')).strip()
        marley_igg = str(data.get('identification', {}).get('igg', '')).strip()
        user_name = str(data.get('identification', {}).get('user_name', '')).strip()
        marley_status = str(data.get('identification', {}).get('status', '')).strip()

        # === Expected Status Mapping ===
        expected_status = expected_mapping.get(marley_status)

        if expected_status is None:
            match_result = f"No mapping for Marley status: '{marley_status}'"
        elif expected_status.lower() not in wetrack_status.lower():
            match_result = f"Expected '{expected_status}' in Wetrack, got '{wetrack_status}'"
        elif expected_status.lower() == "allocated":
            if not marley_igg or not wetrack_igg:
                match_result = "Missing IGG for Allocated"
            elif marley_igg != wetrack_igg:
                match_result = "IGG mismatch for Allocated"
            elif marley_serial != wetrack_serial:
                match_result = "Serial number mismatch"
            else:
                match_result = "Yes"
        else:
            if wetrack_igg:
                match_result = "Unexpected IGG for non-Allocated status"
            elif marley_serial != wetrack_serial:
                match_result = "Serial number mismatch"
            else:
                match_result = "Yes"

    except Exception as e:
        match_result = f"Error: {str(e)}"

    marley_results.append({
        "asset_id": asset_id,
        "marley_serial": marley_serial,
        "wetrack_serial": wetrack_serial,
        "marley_igg": marley_igg,
        "wetrack_igg": wetrack_igg,
        "user_name": user_name,
        "marley_status": marley_status,
        "wetrack_status": wetrack_status,
        "status_match": match_result
    })

# === Save Report ===
df_final = pd.DataFrame(marley_results)
df_final.to_excel(OUTPUT_REPORT_PATH, index=False)
print(f"✅ Report saved to: {OUTPUT_REPORT_PATH}")
