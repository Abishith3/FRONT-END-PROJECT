package com.cucumberdemo.utils;

import com.aventstack.extentreports.ExtentTest;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import java.time.Duration;

/**
 * DriverManager – Thread-safe singleton for WebDriver and ExtentTest.
 * Provides static helpers used by both Hooks and Step Definitions.
 */
public class DriverManager {

    private static final String BASE_URL = "http://localhost:5173";

    // Thread-local WebDriver (safe for parallel runs)
    private static final ThreadLocal<WebDriver>   driverLocal  = new ThreadLocal<>();
    // Thread-local ExtentTest node
    private static final ThreadLocal<ExtentTest>  extentLocal  = new ThreadLocal<>();

    /** Initialise and launch Chrome. Called in @Before hook. */
    public static void initDriver() {
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        // options.addArguments("--headless=new");           // Commented out to run headfully
        options.addArguments("--window-size=1440,900");

        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-extensions");

        WebDriver driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(8));
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));

        driverLocal.set(driver);
        driver.get(BASE_URL);
    }

    /** Quit browser and clean up. Called in @After hook. */
    public static void quitDriver() {
        if (driverLocal.get() != null) {
            driverLocal.get().quit();
            driverLocal.remove();
        }
        extentLocal.remove();
    }

    /** Get the WebDriver for the current thread. */
    public static WebDriver getDriver() {
        return driverLocal.get();
    }

    /** Store ExtentTest node for the current scenario. */
    public static void setExtentTest(ExtentTest test) {
        extentLocal.set(test);
    }

    /** Get ExtentTest node for the current scenario. */
    public static ExtentTest getExtentTest() {
        return extentLocal.get();
    }

    /** Application base URL constant. */
    public static String getBaseUrl() {
        return BASE_URL;
    }
}
