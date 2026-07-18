package com.cucumberdemo.hooks;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;
import com.cucumberdemo.utils.DriverManager;

import io.cucumber.java.After;
import io.cucumber.java.AfterAll;
import io.cucumber.java.Before;
import io.cucumber.java.BeforeAll;
import io.cucumber.java.Scenario;

import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Cucumber Hooks – runs before/after each scenario.
 * Also manages ExtentReports lifecycle for the whole test run.
 */
public class Hooks {

    // ── Shared ExtentReports (static – lives for entire test run) ──────────
    private static ExtentReports  extent;
    private static final String   REPORT_PATH = "test-output/cucumber/ExtentReport.html";

    // ── Per-scenario extent test node ──────────────────────────────────────
    private ExtentTest extentTest;

    // ─────────────────────────────────────────────────────────────────────
    //  Suite-level setup (runs ONCE before all scenarios)
    // ─────────────────────────────────────────────────────────────────────
    @BeforeAll
    public static void initExtentReport() {
        new File("test-output/cucumber/screenshots").mkdirs();

        ExtentSparkReporter spark = new ExtentSparkReporter(REPORT_PATH);
        spark.config().setTheme(Theme.DARK);
        spark.config().setDocumentTitle("EmpowerHR – Cucumber BDD Report");
        spark.config().setReportName("Login Page Automation – 2 Scenarios");
        spark.config().setTimeStampFormat("dd-MM-yyyy HH:mm:ss");

        extent = new ExtentReports();
        extent.attachReporter(spark);
        extent.setSystemInfo("Application",  "EmpowerHR – Employee Management");
        extent.setSystemInfo("URL",           "http://localhost:5173");
        extent.setSystemInfo("Browser",       "Chrome (Headless)");
        extent.setSystemInfo("Framework",     "Cucumber 7 + JUnit 4 + Selenium 4");
        extent.setSystemInfo("Total Scenarios", "2");
        extent.setSystemInfo("OS",            System.getProperty("os.name"));
        extent.setSystemInfo("Java Version",  System.getProperty("java.version"));
        extent.setSystemInfo("Executed On",
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss")));

        System.out.println("\n🥒  Cucumber BDD Automation Starting...");
        System.out.println("📋  Feature : Login Page (2 Scenarios)");
        System.out.println("🌐  App URL  : http://localhost:5173\n");
    }

    // ─────────────────────────────────────────────────────────────────────
    //  Suite-level teardown (runs ONCE after all scenarios)
    // ─────────────────────────────────────────────────────────────────────
    @AfterAll
    public static void flushExtentReport() {
        if (extent != null) extent.flush();
        System.out.println("\n✅  Cucumber run complete.");
        System.out.println("📊  Report saved → " + REPORT_PATH + "\n");
    }

    // ─────────────────────────────────────────────────────────────────────
    //  Before each scenario – launch browser, create ExtentTest node
    // ─────────────────────────────────────────────────────────────────────
    @Before
    public void setUp(Scenario scenario) {
        // Start browser
        DriverManager.initDriver();

        // Create Extent test node for this scenario
        extentTest = extent.createTest(
                "🥒 " + scenario.getName(),
                "Tags: " + scenario.getSourceTagNames()
        );
        extentTest.info("Scenario started: <b>" + scenario.getName() + "</b>");
        extentTest.info("Status: " + scenario.getStatus());

        // Store in thread-local so steps can access it
        DriverManager.setExtentTest(extentTest);
    }

    // ─────────────────────────────────────────────────────────────────────
    //  After each scenario – capture screenshot on failure, quit browser
    // ─────────────────────────────────────────────────────────────────────
    @After
    public void tearDown(Scenario scenario) {
        WebDriver driver = DriverManager.getDriver();

        if (scenario.isFailed()) {
            // Embed screenshot into Cucumber HTML report
            final byte[] screenshot = ((TakesScreenshot) driver)
                    .getScreenshotAs(OutputType.BYTES);
            scenario.attach(screenshot, "image/png", "Failure Screenshot");

            // Also attach to ExtentReport
            try {
                File src = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
                String ts  = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
                String dest = "test-output/cucumber/screenshots/" + scenario.getName().replaceAll("\\s+", "_") + "_" + ts + ".png";
                src.renameTo(new File(dest));
                if (extentTest != null) {
                    extentTest.addScreenCaptureFromPath(new File(dest).getAbsolutePath(), "Failure Screenshot");
                    extentTest.log(Status.FAIL, "Scenario FAILED: " + scenario.getName());
                }
            } catch (Exception e) {
                System.err.println("Screenshot capture failed: " + e.getMessage());
            }
        } else {
            if (extentTest != null) {
                extentTest.log(Status.PASS, "Scenario PASSED: " + scenario.getName());
            }
        }

        // Quit the browser
        DriverManager.quitDriver();
    }
}
