# UITestSuite

# Setting Up UITestSuite On Your Device:

1. Clone repository to your device
2. Open terminal or Node.js command prompt
3. CD into the tests root folder in project directory and run:
   - yarn
4. Run the cypress gui or run all the test cases depending on what you want to do.
  Running cypress gui is good for development purposes:
  yarn start
  Other cases:
  yarn run:all:headed
  yarn run:all:headless

  All of these will ask you to fill out the same information used in the test cases.

  NOTE: If you want to exit this command prematurely, do not do so when the password prompt comes up.
    This prompt disables terminal output globally.
    in git bash, use the following command to turn terminal output back on if you end up in this state.
      stty echo
    It is best to just hold the enter button down until all form element prompts are done.
