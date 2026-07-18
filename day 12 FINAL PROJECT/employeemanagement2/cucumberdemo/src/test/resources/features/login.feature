# ============================================================
#  EmpowerHR – Login Page BDD Tests
#  Application : http://localhost:5173
#  Run 1 of 2  : Admin login  → Admin Portal (Dashboard)
#  Run 2 of 2  : Employee login → Employee Portal
# ============================================================

Feature: Employee Management Login Page
  As a user of EmpowerHR
  I want to login to the system with my role
  So that I can access my dedicated portal

  Background:
    Given I open the EmpowerHR login page

  # ─────────────────────────────────────────────────────────
  #  RUN 1 OF 2 : Admin Portal Login
  #  Opens browser → selects Admin role → logs in as admin
  # ─────────────────────────────────────────────────────────
  Scenario: Run 1 - Admin logs into the Admin Portal
    When I select the "Administrator" role
    And I enter username "admin" and password "admin123"
    And I click the Sign In button
    Then I should see the admin dashboard with "Dashboard" text
    And the login form should no longer be visible

  # ─────────────────────────────────────────────────────────
  #  RUN 2 OF 2 : Employee Portal Login
  #  Opens browser → selects Employee role → logs in as employee
  # ─────────────────────────────────────────────────────────
  Scenario: Run 2 - Employee logs into the Employee Portal
    When I select the "Employee" role
    And I enter username "aarav.sharma" and password "emp123"
    And I click the Sign In button
    Then I should see the employee portal
    And the login form should no longer be visible
