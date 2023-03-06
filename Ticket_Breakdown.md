# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

Our goal is to provide a feature to associate each agent within a facility with a custom Id.


### Assumptions:

The feature is optional meaning some clients may chose to associate agents with custom Id while other may decide not to.
If a client choses to use this feature all of their agents must have a custom Id.

Custom Ids must be unique within a facility, however agents from different facilities can share the same Id. Therefore when performing queries using an agent Id we must combine the facility Id with the agent Id.

Given the nature of the data, I will assume an SQL database. We will want to ensure that facilities and agent ids are indexed using a non-clustered index. We will likely also have a facilities table, so we will want a foreign key with the facility. We would therefore have a many (agents) to one (facility) relationship. As the agent field is options, it will be nullable.


### Estimations:

For these estimations I will use story points following a Fibonacci sequence (i.e 0.5,1,2,3,5,8) ect. In terms of time we would need to estimate our teams velocity. A good example would be 1 point represents around a day of development, so we can multiple the points by days to get an approximate time.

### Steps:

1. Add the new fields to the entity. This can vary depending on frameworks used. (0.5 points)

2. Either use an ORM framework to generate the required migration, or write an SQL script. (1 point)
    - Ensure we use a non clustered index for custom agent Id
    - Ensure we use non clustered index for the facility Id
    - Ensure we use a foreign key to the facility table.

3. Assuming we use a repository in our code we will need to add the following queries to our repository: (3 points)
    - Existing get agent list should include new field
    - Add custom ids to agents. We should accept a key value pair of agents and Ids. All agents must have an Id or an exception must be produced. Further all custom Ids must be unique.
    - Get agent by custom Id and facility Id. 
    - Modify the existing add agent methods. We will check if any agents in the facility have a custom Id and if so a custom Id must be provided. Further we must ensure the new agent's Id is unique. If either of these validations fail an exception should be thrown.
    - All above code must be unit tested.

4. In our pdf generation service after receiving a list of agents we will check if a custom Id is present. If so, this should be used instead of the existing Id. (1 point)
    - All code must be unit tested

5. At the controller level we must interpret exceptions thrown in step 3 and ensure that when an error occurs a useful error message is returned. (3 points)
	- Modifications to get agents by facility. Id an agent Id is present return it.
    - When creating an agent, we must gracefully handle any errors that occur. We should ensure a useful error message is returned if an agent Id is missing when required or the Id is a duplicate.
    - Add a controller method to receive a key value pair of agents and Ids. We must gracefully handle incomplete lists, lists where and custom agents Id are duplicated, or duplicate database Ids (the existing one).
    - All above code must be unit tested.

### Estimation
In total we have 8.5 points. If we assume our team's velocity is 1 point per day that means 8.5 days or 68 hours.