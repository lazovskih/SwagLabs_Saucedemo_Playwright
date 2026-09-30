import { mergeExpects, mergeTests } from "@playwright/test";
import { test as pageTest, expect as pageExpect } from "./auth.fixture";

export const test = mergeTests(pageTest);
export const expect = mergeExpects(pageExpect);
