# covid-data-visualization
<p align="center">
  <img  src=https://user-images.githubusercontent.com/73339239/139748555-a3423bac-bba7-4961-b04b-1af959f25b92.png>
</p>


## Data

The data is taken from [ourworldindata.org](https://github.com/owid/covid-19-data/tree/master/public/data)
### Data Summary

The JSON file includes all of the following metrics:

```
{
    "continent": [string],            # Continent of the geographical location.       
    "location": [string],             # Geographical location.
    "population": [int],              # Population in 2020.
    "population_density": [float],    # Number of people divided by land area, measured in square kilometers, most recent year available.
    "data":[ 
    {
        "date": [date],               # Date of observation.
        "total_cases": [int],         # Total confirmed cases of COVID-19.
        "new_cases": [int],           # New confirmed cases of COVID-19.
        "new_cases_smoothed": [float],# New confirmed cases of COVID-19 per 1,000,000 people.
        
        .
        .
        .
        
    },
    {
        "date": [date],               # Date of observation.
        "total_cases": [int],         # Total confirmed cases of COVID-19.
       .
       .
    }
]
}
```
### Data Manipulation
Due to it's large size, we used different endpoints in order to minimize data processing time.

### Data Visualization
The data visualization is created with D3.js.


#### Dashboard
<p align="center">
  <img  src=https://user-images.githubusercontent.com/73339239/139751820-09f55ccf-6cce-4030-a54b-564090cf9234.png>
</p>

* Choropleth Map
<p align="center">
  <img  src=https://user-images.githubusercontent.com/73339239/139751930-118f8efa-5fdf-49e2-86cf-4a4bb5677f52.png>
</p>

* Brushable line chart

<p align="center">
  <img  src=https://user-images.githubusercontent.com/73339239/139752150-cb67361b-58c8-4292-bfbd-b221d1ef3c6c.png>
</p>

