---
# These are optional metadata elements. Feel free to remove any of them.
status: {"proposed"}
date: {2024-12-2 when the decision was last updated}
decision-makers: {Michael Ogunrinde, James Bateman, Cory-Newman}
---

# {Database design for AML membership and payment management}

## Context and Problem Statement

{Our AML system requires a robust database design to manage membership and payments information effectively. Membership details must include registration, subscription types and statuses, while payments management must track transactions, amounts, due dates and an adjustement tool to amend underpaid or overpaid payements.Without a well-strctured database, the system may face issues like inconsistent membership statuses, errors in payment records, and difficulties generating reports for accountants}

<!-- This is an optional element. Feel free to remove. -->
## Decision Drivers

* {decision driver 1, The database must support scaling to accomodate future growth }
* {decision driver 2, it must ensure high data integrity and minimal chances errors in membership or payemnt records}
* {decision driver 3, it should integrate easily with the borrowing and notification systems.}
* {decision driver 4, it must protect sensitive payment data from unauthorised access through encryption and access control}
* {decision driver 5, it must be flexible to allow non-members to use some of the key functionalities of the website.}

## Considered Options

* {title of option 1, Use a relational database management system like MySQL or PostgreSQL, which can use a relational schema with auxiliary tables for flexibility.}
* {title of option 2, Seperate tables for membership and payment information, linked by a foreign key in the membership table for example "membership_id".}
* {title of option 3, Combine membership and payment information in a single table, with a column for each membership and payment attribute.}
* {title of option 4, Use a NoSQL database like MongoDB, which can store data in a flexible, schema-less format.}
* {title of option 5, Use a hybrid approach, with a relational database for membership information and a NoSQL database for payment information.}
* … <!-- numbers of options can vary -->

## Decision Outcome

Chosen option: "{Separate tables for membership and payment information, linked by a foreign key. (title of option 1/title of option 2)}", because {justification: This approach ensures moduloarity, making it easier to scale and maintain. Payement records are isolated from membership details for better perfomance when querying large transaction datasets, as well as enforcing security. This design also allows for:

1. indenpendant scaling of membership and payment tables to handle increasing records.
2. clear seperation reduces risk of data corruption and simplifies validation.
3. sensitive payment data is isolated, allowing focused access control and encryption strategies.

Although other options may also staisfy some decision drivers, this option performs best overall by meeting scalability, maintainability, and integration requirements. The trade-offs of additional complexity in queries and joins are considered acceptable given the long-term benefits. Furthermore, our team is familiar with relational database schemas, ensuring easier implementation and maintenance}.

<!-- This is an optional element. Feel free to remove. -->
### Consequences

* Good, because {positive consequence, allows for efficent quries and modular design}
* Bad, because {negative consequence, slightly increases complexitity when joining tables for cross-references}
* … <!-- numbers of consequences can vary -->

<!-- This is an optional element. Feel free to remove. -->
### Confirmation

{ We will confirm this decision by implementing the database schema and testing it with a small dataset. The schema will be reviewed with the team to ensure it meets the requirements and is understood by all members. Queries for common tasks will be benchmarked to ensure optimal performance under load. Additionally, the system will be monitored for performance issues, and the schema will be adjusted as needed.}

<!-- This is an optional element. Feel free to remove. -->
## Pros and Cons of the Options

### {Relational database (General schema)}

<!-- This is an optional element. Feel free to remove. -->
{example | description | pointer to more information | …}

* Good, because {clear seperation of concerns, allows for efficent quries and modular design}
* Good, because {clear structure and normalization principles ensure data integrity. }
<!-- use "neutral" if the given argument weights neither for good nor bad -->
* Neutral, because {requires schema adjustments for scalability and flexibility.}
* Bad, because {may result in overly complex joins for highly interconnected data.}
* … <!-- numbers of pros and cons can vary -->

### {NoSQL database (MongoDB)}

{example | description | pointer to more information | …}

* Good, because {highly flexible and suitable for unstructured or rapidly changing data.}
* Good, because {excellent scalability for massive datasets.}
* Neutral, because {poor fit for applications requiring complex relationships between entities.}
* Bad, because {higher learning curve for developers accustomed to relational databases}
* …

<!-- This is an optional element. Feel free to remove. -->
## More Information

{Additional evidence and validation for this decision will include an ERD (Entity-Relationship Diagram) and test results from a sample implementation. Team agreement has been documented, and the design will be revisited periodically to ensure it continues to meet the system’s needs. Links to other resources, such as schema documentation and meeting notes, will also be maintained}
