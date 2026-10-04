import assert from "node:assert/strict";
import test from "node:test";

import { parseBadgeVault } from "../scripts/badgeVault.mjs";

test("parses the current object-shaped BadgeVault feed", () => {
    assert.deepEqual(parseBadgeVault({
        "123": [{ name: "Contributor", badge: "https://example.com/badge.png" }]
    }), [{
        userId: "123",
        badges: [{ name: "Contributor", badge: "https://example.com/badge.png" }]
    }]);
});

test("keeps compatibility with the legacy API response", () => {
    assert.deepEqual(parseBadgeVault([{
        userId: "456",
        badges: [
            { name: "Approved", badge: "https://example.com/approved.png" },
            { name: "Pending", badge: "https://example.com/pending.png", pending: true }
        ]
    }]), [{
        userId: "456",
        badges: [{ name: "Approved", badge: "https://example.com/approved.png" }]
    }]);
});

test("rejects an empty or malformed feed instead of wiping badges", () => {
    assert.throws(() => parseBadgeVault({}), /refusing to publish an empty dataset/);
    assert.throws(() => parseBadgeVault("not json"), /unsupported payload/);
});
