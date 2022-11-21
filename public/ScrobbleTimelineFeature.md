# Scrobble Timeline Feature / Component

## Thesis
In order to wrap my head around the different parts of making this Timeline component (the API, React, JS, etc) I'm going to make a little document to help keep track of the thought process. Additionally this may serve as a Blog topic idea, as a lot of the pieces to getting a local GraphQL query through Apollo and the Next.js API routes were difficult to find.

### The API
At this point, the API needs to be capable of identifying a start and end UTS (Unix Timestamp) to query a 'months' worth of scrobbles.
The point to begin here being understanding how Unix Timestamps work.

Counting up from 0, UTS determines 1 second a value of 1 in UNIX time. Therefore from the starting point of Jan 1, 1970 UNIX keeps track of time counting seconds up until the current time. At the time of writing this README, the time reads 1668795718.

Converting this to a legible time for us (translation back and forth being crucial to the calculation of the API) we divide by the following units and remainders until we reach our 'Human time':

```
	currentTime: 	1668795718
	oneYear: 		  31536000
	
	currentTime / oneYear = 52 (roughly)
	
	therefore 52 years have passed since 1970 (true, in the year 2022)
```

More bullet point notes:
- 1. the starting month will never change. Once this is calculated once, we no longer have to look for it again.
	- 1a. June 2016 has my first Scrobble. June 1, 2016 UTS - 8 hours for PST conversion is 1464710400
- 2. create a case/switch that takes the Month name and returns the correct volume of time in UTS seconds
- 3. for the dates that exist between the start / end values, return all scrobbles

### The React Component

### The Markup