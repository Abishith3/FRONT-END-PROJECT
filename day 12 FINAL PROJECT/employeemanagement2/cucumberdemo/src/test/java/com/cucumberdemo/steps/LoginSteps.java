package com.cucumberdemo.steps;

import com.aventstack.extentreports.ExtentTest;
import com.cucumberdemo.utils.DriverManager;

import io.cucumber.java.en.*;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.*;

import org.junit.Assert;

import java.time.Duration;
import java.util.List;

/**
 * Step Definitions for login.feature
 *
 * Maps every Gherkin step to a Selenium action against:
 *   http://localhost:5173  (EmpowerHR – Employee Management)
 *
 * Both scenarios share the same step definitions:
 *   - Scenario 1: Valid admin login  → dashboard appears
 *   - Scenario 2: Invalid admin login → error message appears
 */
public class LoginSteps {

    // ── Convenience getters ───────────────────────────────────────────────
    private WebDriver getDriver()  { return DriverManager.getDriver(); }
    private ExtentTest getTest()   { return DriverManager.getExtentTest(); }

    /** Creates a new WebDriverWait (renamed from wait() to avoid java.lang.Object conflict). */
    private WebDriverWait getWait() {
        return new WebDriverWait(getDriver(), Duration.ofSeconds(15));
    }

    // ── Small pause helper ────────────────────────────────────────────────
    private void pause(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ignored) {}
    }

    // ═════════════════════════════════════════════════════════════════════
    //  BACKGROUND STEP
    // ═════════════════════════════════════════════════════════════════════

    /**
     * Background: Given I open the EmpowerHR login page
     * Verifies the login page title and brand name are visible.
     */
    @Given("I open the EmpowerHR login page")
    public void i_open_the_empowerhr_login_page() {
        WebDriver driver = getDriver();

        // The driver already navigated to BASE_URL in Hooks > initDriver()
        // Verify the login page loaded correctly
        WebElement brand = getWait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//h1[contains(text(),'EmpowerHR')]")));

        Assert.assertTrue("EmpowerHR brand should be visible on login page",
                brand.isDisplayed());

        // Verify role selection cards are present
        WebElement adminCard = driver.findElement(
                By.xpath("//button[.//p[contains(text(),'Administrator')]]"));
        WebElement empCard   = driver.findElement(
                By.xpath("//button[.//p[contains(text(),'Employee')]]"));

        Assert.assertTrue("Administrator role card should be present", adminCard.isDisplayed());
        Assert.assertTrue("Employee role card should be present",      empCard.isDisplayed());

        getTest().info("✅ EmpowerHR login page opened successfully");
        getTest().info("   Brand: <b>" + brand.getText() + "</b>");
        getTest().info("   Role cards present: Administrator | Employee");
    }

    // ═════════════════════════════════════════════════════════════════════
    //  WHEN STEPS
    // ═════════════════════════════════════════════════════════════════════

    /**
     * When I select the "Administrator" role
     * When I select the "Employee" role
     */
    @When("I select the {string} role")
    public void i_select_the_role(String role) {
        String label = role.equals("Administrator") ? "Administrator" : "Employee";

        WebElement roleBtn = getWait().until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath("//button[.//p[contains(text(),'" + label + "')]]")));
        roleBtn.click();

        getTest().info("🖱️  Selected role: <b>" + role + "</b>");

        // After clicking a role, the login form (username input) should appear
        WebElement usernameField = getWait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//input[@placeholder='Enter username']")));
        Assert.assertTrue("Login form should appear after role selection",
                usernameField.isDisplayed());

        // Verify the correct portal badge is shown
        String badgeText = role.equals("Administrator") ? "Admin Portal" : "Employee Portal";
        WebElement badge = getWait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//*[contains(text(),'" + badgeText + "')]")));
        Assert.assertTrue("Portal badge should show '" + badgeText + "'",
                badge.isDisplayed());

        getTest().info("   Portal badge visible: <b>" + badge.getText() + "</b>");
    }

    /**
     * And I enter username "admin" and password "admin123"
     */
    @And("I enter username {string} and password {string}")
    public void i_enter_username_and_password(String username, String password) {
        WebDriver driver = getDriver();

        WebElement usernameField = getWait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//input[@placeholder='Enter username']")));
        usernameField.clear();
        usernameField.sendKeys(username);

        WebElement passwordField = driver.findElement(
                By.xpath("//input[@placeholder='Enter password']"));
        passwordField.clear();
        passwordField.sendKeys(password);

        // Mask the actual password in the log
        String maskedPass = password.isEmpty() ? "(empty)" : "*".repeat(password.length());
        getTest().info("⌨️  Entered credentials → username: <b>" + username
                + "</b> | password: <b>" + maskedPass + "</b>");
    }

    /**
     * And I click the Sign In button
     */
    @And("I click the Sign In button")
    public void i_click_the_sign_in_button() {
        WebElement submitBtn = getWait().until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath("//button[@type='submit']")));

        String btnText = submitBtn.getText().trim();
        submitBtn.click();

        getTest().info("🖱️  Clicked Sign In button: <b>\"" + btnText + "\"</b>");

        // App has a 900ms artificial delay + React re-render time → wait 2.5s
        pause(2500);
    }

    // ═════════════════════════════════════════════════════════════════════
    //  THEN STEPS – Scenario 1: Valid Login
    // ═════════════════════════════════════════════════════════════════════

    /**
     * Then I should see the admin dashboard with "Dashboard" text
     */
    @Then("I should see the admin dashboard with {string} text")
    public void i_should_see_the_admin_dashboard_with_text(String expectedText) {
        WebElement dashboardElement = getWait().until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath("//*[contains(text(),'" + expectedText + "')]")));

        Assert.assertTrue(
                "Admin dashboard should show '" + expectedText + "'",
                dashboardElement.isDisplayed());

        getTest().info("✅ Dashboard element found: <b>" + dashboardElement.getText() + "</b>");
        getTest().pass("Admin login SUCCESS – Dashboard is visible after login");
    }

    /**
     * And the login form should no longer be visible
     */
    @And("the login form should no longer be visible")
    public void the_login_form_should_no_longer_be_visible() {
        // After successful login the submit button / sign-in form disappears
        boolean loginFormGone = getWait().until(
                ExpectedConditions.invisibilityOfElementLocated(
                        By.xpath("//button[@type='submit']")));

        Assert.assertTrue("Login form should not be visible after successful login",
                loginFormGone);

        // Also confirm we are NOT on the login page (role cards gone)
        List<WebElement> roleCards = getDriver().findElements(
                By.xpath("//button[.//p[contains(text(),'Administrator')]]"));
        Assert.assertTrue("Role selection cards should be gone after login",
                roleCards.isEmpty());

        getTest().info("✅ Login form is no longer visible – user is inside the portal");
        getTest().pass("Post-login state confirmed: login form hidden, portal active");
    }

    // ═════════════════════════════════════════════════════════════════════
    //  THEN STEPS – Scenario 2: Invalid Login (Negative Test)
    // ═════════════════════════════════════════════════════════════════════

    /**
     * Then I should see an error message "Invalid credentials"
     */
    @Then("I should see an error message {string}")
    public void i_should_see_an_error_message(String expectedError) {
        // Use contains(., '...') instead of contains(text(), '...') because the error
        // div contains a child <span>⚠️</span> that splits text nodes.
        // contains(.) checks the full concatenated text content of the element.
        WebElement errorBox = getWait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//*[contains(.,'" + expectedError + "') and not(self::html) and not(self::body)]")));

        Assert.assertTrue(
                "Error message '" + expectedError + "' should be visible",
                errorBox.isDisplayed());

        String actualText = errorBox.getText().trim();
        Assert.assertTrue(
                "Error text should contain '" + expectedError + "' but was: '" + actualText + "'",
                actualText.contains(expectedError));

        getTest().info("⚠️  Error message displayed: <b>\"" + actualText + "\"</b>");
        getTest().pass("Invalid login correctly shows error: \"" + actualText + "\"");
    }

    /**
     * And the login form should still be visible
     */
    @And("the login form should still be visible")
    public void the_login_form_should_still_be_visible() {
        WebElement submitBtn = getWait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//button[@type='submit']")));
        Assert.assertTrue("Sign In button should remain visible after failed login",
                submitBtn.isDisplayed());

        // The role badge (Admin Portal) should still be showing
        WebElement badge = getDriver().findElement(
                By.xpath("//*[contains(text(),'Admin Portal')]"));
        Assert.assertTrue("Admin Portal badge should still be visible after failed login",
                badge.isDisplayed());

        getTest().info("✅ Login form still visible after invalid login attempt");
        getTest().pass("Negative test PASSED – user remains on login page with form intact");
    }

    // ═════════════════════════════════════════════════════════════════════
    //  THEN STEPS – Scenario 3: Employee Login
    // ═════════════════════════════════════════════════════════════════════

    /**
     * Then I should see the employee portal
     */
    @Then("I should see the employee portal")
    public void i_should_see_the_employee_portal() {
        WebElement portalHeader = getWait().until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath("//*[contains(text(),'Aarav') or contains(text(),'My Dashboard') or contains(text(),'Welcome')]")));
        Assert.assertTrue("Employee portal should load and show welcome message or name",
                portalHeader.isDisplayed());
        getTest().info("✅ Employee portal loaded successfully showing text: <b>" + portalHeader.getText() + "</b>");
        getTest().pass("Employee login SUCCESS – Employee Portal is visible");
    }
}

