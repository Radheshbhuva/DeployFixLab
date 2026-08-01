# 06_Risk_Register

# DeployFix Lab Risk Register

  ------------------------------------------------------------------------------------
  ID      Risk              Impact       Probability     Mitigation        Owner
  ------- --------------- ----------- ------------------ ----------------- -----------
  R-001   Scope creep        High           Medium       Freeze sprint     Technical
                                                         scope             Lead

  R-002   Merge conflicts   Medium           High        Feature branches  All
                                                         & PR reviews      

  R-003   Docker             High           Medium       Validate          Technical
          configuration                                  containers        Lead
          failures                                       frequently        

  R-004   Database schema    High           Medium       Use Prisma        Backend
          issues                                         migrations        

  R-005   API integration   Medium          Medium       Contract-first    Frontend &
          failures                                       development       Backend

  R-006   Environment        High            High        Maintain          Technical
          variable                                       .env.example      Lead
          mistakes                                                         

  R-007   Deployment         High           Medium       Test staging      Technical
          failures                                       deployment        Lead

  R-008   Missed            Medium          Medium       Weekly sprint     Team
          deadlines                                      reviews           

  R-009   Documentation     Medium          Medium       Update docs each  All
          drift                                          sprint            

  R-010   Knowledge silos   Medium           Low         Pair programming  Team
                                                         & reviews         
  ------------------------------------------------------------------------------------

## Risk Review

-   Review risks every sprint.
-   Add new risks when discovered.
-   Close risks once mitigated.
