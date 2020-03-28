from urllib.request import urlopen as request
from bs4 import BeautifulSoup as soup
import datetime 
import os
targetUrl = 'https://www.eia.gov/dnav/ng/hist/rngwhhdD.htm'
prices_daily = 'output/' + 'daily_prices.csv'
prices_monthly = 'output/' + 'monthly_prices.csv'


def create_connection():
    #open connection
    client = request(targetUrl)
    page_content = client.read()

    #close connection
    client.close()
    fetch_node(page_content)
    

def fetch_node(content):
    page_soup = soup(content, "html.parser")
    found = page_soup.find(summary="Henry Hub Natural Gas Spot Price (Dollars per Million Btu)")
    fetch_data(found)


    

def fetch_data(fetched_node):
    data = []
    

    for node in fetched_node.find_all('tr'):
        date_node = node.find('td', {'class': 'B6'})
        if date_node:
            date = date_node.text.replace('\xa0\xa0', '')
            data.append([date, *[prices.text for prices in node.find_all('td', {'class': 'B3'})]])
    data = format_prices(data)
    data.reverse()
    

    print_monthly_prices(data)
    print_daily_prices(data)
    print('Done')


def format_prices(data):
    collation = []
    for week in data:
      start_date = clean_start_date(week[0])
      day_offset = 0
      for daily_price in week[1:]:
        day = start_date + datetime.timedelta(days = day_offset)
        collation.append([day.strftime('%d-%b-%Y'), daily_price])
        day_offset += 1
    return collation

def clean_start_date(date):
    start_date = date.replace('- ',' ').replace('-', ' ').split(' ')[0:3]
    return datetime.datetime.strptime('-'.join(start_date), '%Y-%b-%d')


def print_daily_prices(data):   
    with open(prices_daily, 'w') as csv_handle:
        csv_handle.write('Dates, Prices \n')
        for day in data:
            csv_handle.write(','.join(day))
            csv_handle.write('\n')
        


def print_monthly_prices(data):
    with open(prices_monthly, 'w') as csv_handle:
        csv_handle.write('MONTH, PRICE \n')
        prev_month = data[0]

        for month in data:
            if(int(month[0].split('-')[0]) > int(prev_month[0].split('-')[0])):
                csv_handle.write(prev_month[0][3:] + ',' + prev_month[1])
                csv_handle.write('\n')
            prev_month = month


create_connection()