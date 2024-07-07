import requests
import os
import json
import matplotlib.pyplot as plt
from lightweight_charts import Chart
import pandas as pd
from dotenv import load_dotenv
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

load_dotenv()
API_KEY = os.getenv("API_KEY")

def main():

    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }
  
    assetType = "CfdOnIndex"
    period = 1
    # Choose the pair you want, the second number will be 'Close2'
    uics = [4913, 4911]
    df = pd.DataFrame()

    for month in range(3, 12):
        print("Fetching prices...")
        for day in range(1, 31):
            with ThreadPoolExecutor() as executor:
                futures = [executor.submit(get_historical_prices, headers, assetType, uic, period, day, month) for uic in uics]
                responses = [future.result() for future in futures]
                formatted_responses = [format_json(response) for response in responses]

            # Extract data for uic=4913
            close_ask_values_4913 = [data['CloseAsk'] for data in formatted_responses[0]['Data']]
            time_values = [datetime.strptime(data['Time'], '%Y-%m-%dT%H:%M:%S.%fZ') for data in formatted_responses[0]['Data']]
            high_ask_values = [data['HighAsk'] for data in formatted_responses[0]['Data']]
            low_ask_values = [data['LowAsk'] for data in formatted_responses[0]['Data']]
            open_ask_values = [data['OpenAsk'] for data in formatted_responses[0]['Data']]

            # Extract data for uic=4911
            close_ask_values_4911 = [data['CloseAsk'] for data in formatted_responses[1]['Data']]

            # Create a pandas DataFrame with the data
            new_data = pd.DataFrame({
                "Date": time_values,
                "Open": open_ask_values,
                "High": high_ask_values,
                "Low": low_ask_values,
                "Close": close_ask_values_4913,
                "Close2": close_ask_values_4911
            })
            df = pd.concat([df, new_data])

        df.to_csv("pricespair.csv", index=False)
        

def get_historical_prices(headers, assetType, uic, period, day, month):
    base_url = "https://gateway.saxobank.com/sim/openapi"
    endpoint = f"/chart/v1/charts?AssetType={assetType}&Horizon={period}&Mode=From&Time=2019-{month}-{day}&Uic={uic}"
    response = requests.get(base_url + endpoint, headers=headers)
    return response.json()

def format_json(json_data):
    return json.loads(json.dumps(json_data, indent=4))

if __name__ == "__main__":
    main()
