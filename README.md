# SaxoOpenAPI Tools

## fetchprice.py 
<<<<<<< HEAD
Depending on the time horizon set, there are different limits to how much price data you can fetch in 
one request. Specifically for 1 minute data, you only get one day's worth of prices. To handle this 
limitation, you can loop through each day and month to fetch and aggregate the data incrementally:
=======
Depending on the time horizon set, there are different limits to how much price data you can fetch in one request. Specifically for 1 minute data, you only get one day's worth of prices. To handle this limitation, you can loop through each day and month to fetch and aggregate the data incrementally:
>>>>>>> fc7bbd30df6b511ef35cd1f00ed2fa1ff1fe8338

```python
    for month in range(1, 12):
        for day in range(1, 31):
<<<<<<< HEAD
            response = get_historical_prices(headers, assetType=assetType, uic=uic, period=period, 
day=day, month=month)
            formatted_response = format_json(response)
            #Get all the necessary data from the response
            close_ask_values = [data['CloseAsk'] for data in formatted_response['Data']]
            time_values = [datetime.strptime(data['Time'], '%Y-%m-%dT%H:%M:%S.%fZ') for data in 
formatted_response['Data']]
=======
            response = get_historical_prices(headers, assetType=assetType, uic=uic, period=period, day=day, month=month)
            formatted_response = format_json(response)
            #Get all the necessary data from the response
            close_ask_values = [data['CloseAsk'] for data in formatted_response['Data']]
            time_values = [datetime.strptime(data['Time'], '%Y-%m-%dT%H:%M:%S.%fZ') for data in formatted_response['Data']]
>>>>>>> fc7bbd30df6b511ef35cd1f00ed2fa1ff1fe8338
            high_ask_values = [data['HighAsk'] for data in formatted_response['Data']]
            low_ask_values = [data['LowAsk'] for data in formatted_response['Data']]
            open_ask_values = [data['OpenAsk'] for data in formatted_response['Data']]
            #Then we make a pandas datafram with the data, into a csv file
<<<<<<< HEAD
            new_data = pd.DataFrame({"Date": time_values, "Open": open_ask_values, "High": 
high_ask_values, "Low": low_ask_values, "Close": close_ask_values})
            df = pd.concat([df, new_data])
        df.to_csv("prices.csv", index=False)
```
An error will still be thrown for monthly ranges higher than 4, and from January to March due to 
February only being 28 days. 
=======
            new_data = pd.DataFrame({"Date": time_values, "Open": open_ask_values, "High": high_ask_values, "Low": low_ask_values, "Close": close_ask_values})
            df = pd.concat([df, new_data])
        df.to_csv("prices.csv", index=False)
```
An error will still be thrown for monthly ranges higher than 4, and from January to March due to February only being 28 days. 
>>>>>>> fc7bbd30df6b511ef35cd1f00ed2fa1ff1fe8338

## infoGUI.py


<<<<<<< HEAD
=======

>>>>>>> fc7bbd30df6b511ef35cd1f00ed2fa1ff1fe8338
