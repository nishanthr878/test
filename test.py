import pandas as pd
import requests
import json
from requests.auth import HTTPBasicAuth

# === Config ===
WETRACK_EXCEL_PATH = 'wetrack_data.xlsx'  # Your input file
OUTPUT_REPORT_PATH = 'marley_wetrack_comparison_report.xlsx'
API_BASE_URL = 'https://asset/api/v2/hardware/desktop/'
USERNAME = 'gsc_dws_usu_wt'
PASSWORD = 'your_password_here'  # Use secure method in real use
CACERT_PATH = '/path/to/cacert.pem'  # Replace with correct CA cert path

# === Mapping between Marley and expected Wetrack status ===
expected_mapping = {
    ("Active", "In Use"): "Allocated",
    ("To be reused", "Unused"): "Stock",
    ("Given to technical teams", "Unused"): "Store to Proximit",
    ("To Check", "Unused"): "Investigation",
    ("To be destroyed", "Unused"): "Ewaste"
}

# === Load Wetrack Excel ===
wetrack_df = pd.read_excel(WETRACK_EXCEL_PATH)

# === Output Data ===
marley_results = []

# === Process each Wetrack entry ===
for index, row in wetrack_df.iterrows():
    asset_id = str(row.get('asset_id', '')).strip()
    wetrack_igg = str(row.get('igg', '')).strip()
    wetrack_status = str(row.get('wetrack_status', '')).strip()

    # Initialize placeholders
    marley_igg = marley_status = marley_usage = marley_serial = user_name = match_result = ""

    try:
        # Fetch Marley data
        response = requests.get(
            API_BASE_URL + asset_id,
            verify=CACERT_PATH,
            auth=HTTPBasicAuth(USERNAME, PASSWORD)
        )
        data = json.loads(response.text)

        marley_serial = data.get('fixed', {}).get('serial_number', '')
        marley_igg = str(data.get('identification', {}).get('igg', '')).strip()
        user_name = data.get('identification', {}).get('user_name', '')
        marley_status = data.get('identification', {}).get('status', '')
        marley_usage = data.get('identification', {}).get('usage', '')

        # Determine expected Wetrack status
        expected_status = expected_mapping.get((marley_status, marley_usage), None)

        # Matching logic
        if expected_status is None:
            match_result = "No mapping for Marley status/usage"
        elif expected_status.lower() not in wetrack_status.lower():
            match_result = f"Expected '{expected_status}', got '{wetrack_status}'"
        elif expected_status.lower() == "allocated":
            if not marley_igg or not wetrack_igg:
                match_result = "Missing IGG for Allocated"
            elif marley_igg != wetrack_igg:
                match_result = "IGG mismatch for Allocated"
            else:
                match_result = "Yes"
        elif expected_status.lower() != "allocated" and wetrack_igg:
            match_result = "Unexpected IGG for non-Allocated status"
        else:
            match_result = "Yes"

    except Exception as e:
        match_result = f"Error: {str(e)}"

    # Append result
    marley_results.append({
        "asset_id": asset_id,
        "serial_number": marley_serial,
        "marley_igg": marley_igg,
        "wetrack_igg": wetrack_igg,
        "user_name": user_name,
        "marley_status": marley_status,
        "marley_usage": marley_usage,
        "wetrack_status": wetrack_status,
        "status_match": match_result
    })

# === Save Final Report ===
df_final = pd.DataFrame(marley_results)
df_final.to_excel(OUTPUT_REPORT_PATH, index=False)
print(f"Comparison report saved to: {OUTPUT_REPORT_PATH}")
