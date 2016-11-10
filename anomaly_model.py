# -*- coding: utf-8 -*-
"""
Created on Wed Sep 21 10:10:32 2016
Edited on Thu Sep 22 13:42:22 2016

@author: CPU10902-local
"""

# use package season to calculate the remainder, then we get IQR to detect outliers
from seasonal import fit_seasons, adjust_seasons
import numpy as np
import statsmodels.api as sm


# recive a list
def anomaly(data_col, period=7, trend_type="median"):
    remainder = []
    indice = []
    NUM_DAYS =60
    # flag = False
    # previous_season = None
    # season_ = []
    # detrend and deseasonalize
    for i in range((period*2), len(data_col)):
        if (i>=NUM_DAYS):
            d=data_col[(i-NUM_DAYS+1):(i + 1)]
        else:
            d = data_col[:(i + 1)]
        # d = data_col[:(i + 1)]
        seasons, trend = fit_seasons(d, trend=trend_type, period=period, min_ev=0.05)


        if (seasons is None):
            seasons = [0L] *period





        adjusted = adjust_seasons(d, seasons=seasons)
       
        residual = adjusted - trend
       

        remainder.append(residual[(len(residual)-1)])
        indice.append(i)

    remainder = [round(elem, 1) for elem in remainder]

    q75, q25 = np.percentile(remainder, [75, 25])
    IQR = q75 - q25

    low_threshold = q25 - IQR * 1.5
    high_threshold = q75 + IQR * 1.5

    outliers = [0L] * len(data_col)

    for i in range(len(remainder)):
        if (remainder[i] > high_threshold or remainder[i] < low_threshold):
            outliers[indice[i]] = 1L

    return outliers

# test
# a=ano_points(d2)

def calc_trend(data_col, period = 7): #data_col is a array
    res = sm.tsa.seasonal_decompose(data_col,  freq=period) # Moving Average 
    trend = res.trend # decompose trend into 'trend' variable
    season = res.seasonal
    
    #fill nan values in the MA result by the average or 7 neibough obs
    amount_nan = period//2

    #fill at the starting points
    for i in range(0,amount_nan):
        trend[i] = np.mean(trend[(i+amount_nan):(i+amount_nan+6)])
        season[i] = np.mean(season[(i+amount_nan):(i+amount_nan+6)])
    
    #in the end as well:
    for i in range((len(trend)-amount_nan), len(trend)):
        trend[i] = np.mean(trend[(i-amount_nan-6):(i-amount_nan)])
        season[i] = np.mean(season[(i-amount_nan-6):(i-amount_nan)])

    return (trend,season)
	
#calculate the trend of the data
def trend_calculate(data,period=7,num_points=4):
    ### init 'trend_result' variable to store the trend
    trend_result = []

    # detrend and deseasonalize
    for i in range(period, len(data)):
        if (i > 90):
            d_new = data[(i - 90):(i + 1)]
        else:
            d_new = data[:(i+1)] # just take the data from start to current point

        res = sm.tsa.seasonal_decompose(d_new,  freq=period) # Moving Average
        trend = res.trend # decompose trend into 'trend' variable
        trend_result.append(trend[(len(trend)-1-(period//2))])


    # fill nan values in the MA result by the average or 7 neib obs
    amount_nan = period // 2
    trend_temp1 = []

    trend_temp2 = []
    # fill at the starting points
    for i in range(0, (amount_nan+1)):
        trend_temp1.append(np.mean(trend_result[(i + amount_nan):(i + amount_nan + 6)]))

    # in the end as well:
    for i in range((len(trend_result) - amount_nan), len(trend_result)):
        trend_temp2.append(np.mean(trend_result[(i - amount_nan - 6):(i - amount_nan)]))
    trend_result = trend_temp1 + trend_result + trend_temp2

    trend_result_2 = [ round(elem, 1) for elem in trend_result ] # round the result
    t = np.diff(trend_result_2) #calculate diff 1-lag
                
    res = [0L]* (num_points) #shift the result to the right a mount of num_points 
    for i in range((num_points-1),len(t)): #go through the data (the trend)
        if(max(t[(i-num_points+1):(i+1)]) < 0):
            res.append(1L) #anomaly point
        else:
            res.append(0L) #normal point
    return(res) #return a list
	
