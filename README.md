# Candidate Explorer

## Purpose
This app is meant to help users discover candidates around the country based on various identity criteria. 

## Features
### Filter Bar
The filter bar on the left dynamically applies filters to the list of candidates. Within each category (Gender, Professions, Ethnicity, Sexuality), the filters are OR functions. Across the categories, the filters are AND functions. This way, you can easily see all the Female Veterans, for example.

### More Information
If you click on Show More, a modal appears with more information about the candidate and includes a link to the website where you can donate or volunteer.

### Edit
If you click on the Edit button, it will open a similar modal, but this one will be editable. You can also Delete the candidate from this view. Making edits or deleting will automatically update the page live without refreshing.

### Add a Candidate
Users can add a new candidate from the tab along the top. 

## Coding
### Back end
The backend runs on Node with Express and uses a MongoDB database with Mongoose. The controller merely responds to api calls by sending back JSON files.

### Front end
The front end is mostly developed with VueJS. I did not use Vue CLI, although I should have. I definitely need help to DRY it up. 

