package com.cucumberdemo.runner;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;

/**
 * ============================================================
 *  Cucumber Test Runner
 *
 *  Runs EXACTLY 2 scenarios from login.feature:
 *    1. Successful admin login with valid credentials
 *    2. Failed admin login with invalid credentials
 *
 *  Reports:
 *    - HTML  → test-output/cucumber/cucumber-html-report/
 *    - JSON  → test-output/cucumber/cucumber.json
 *    - Dark ExtentReport → test-output/cucumber/ExtentReport.html
 *
 *  Run via Maven:
 *    mvn clean test -f pom.xml
 * ============================================================
 */
@RunWith(Cucumber.class)
@CucumberOptions(

        // ── Feature file location ───────────────────────────────────────
        features = "src/test/resources/features",

        // ── Step definitions + Hooks package ───────────────────────────
        glue = {
            "com.cucumberdemo.steps",
            "com.cucumberdemo.hooks"
        },

        // ── Reports ────────────────────────────────────────────────────
        plugin = {
            "pretty",                                              // console pretty-print
            "html:test-output/cucumber/cucumber-html-report",     // Cucumber built-in HTML
            "json:test-output/cucumber/cucumber.json",            // JSON for CI tools
            "timeline:test-output/cucumber/timeline"              // execution timeline
        },

        // ── Show all steps in console even when passing ─────────────────
        publish = false,

        // ── Monochrome console output ───────────────────────────────────
        monochrome = true,

        // ── Tag filter – run ALL scenarios in the feature (= 2 total) ──
        tags = "not @ignore"
)
public class TestRunner {
    // JUnit 4 will pick this up automatically via @RunWith
    // Maven Surefire is configured to include this class only
}
