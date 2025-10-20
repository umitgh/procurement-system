# Bugs & Issues Found During Testing

## Date: 2025-10-20
## Tester: Manual testing + Playwright

---

## 🔴 CRITICAL ISSUES

### Issue #1: Database Seed Script Field Name Mismatch
**Status**: FIXED
**Priority**: CRITICAL
**Page/Component**: prisma/seed.ts
**Steps to Reproduce**:
1. Run `npm run prisma:seed`
2. Script fails at item creation

**Expected Behavior**: Items should be created successfully
**Actual Behavior**: Script fails with "Unknown argument `unitPrice`"
**Error Message**: `Unknown argument 'unitPrice'. Available options are marked with ?.`
**Fix Applied**:
- Changed `unitPrice` to `suggestedPrice` in Item model creation (lines 136, 145)
- Changed `item.unitPrice` to `item.suggestedPrice` when creating PO line items (lines 170, 179)
- Added missing `lineNumber` field to POLineItem creation (lines 173, 182)

---

## 🟡 MEDIUM PRIORITY ISSUES

### Issue #2: Login Button Click Not Triggering Form Submit (Playwright)
**Status**: WORKAROUND APPLIED
**Priority**: MEDIUM
**Page/Component**: /login page
**Steps to Reproduce**:
1. Navigate to /login
2. Fill in email and password fields
3. Click the "התחבר" button with Playwright `.click()`

**Expected Behavior**: Form should submit and authenticate user
**Actual Behavior**: Button click event doesn't trigger form submission
**Root Cause**: Possible React hydration timing issue or event handler attachment delay
**Workaround**: Using `document.querySelector('form').requestSubmit()` works perfectly
**Note**: Manual browser testing needed to confirm if this affects real users or is Playwright-specific
**Authentication Status**: ✅ Working correctly - password validation, user lookup, session creation all functional

---

## 🟢 LOW PRIORITY ISSUES / IMPROVEMENTS

### Issue #: [To be filled]
**Status**:
**Priority**:
**Description**:

---

## ✅ FIXED ISSUES

### Issue #: [To be filled]
**Status**: FIXED
**Description**:
**Fix**:

---

## Testing Notes

### Areas Tested:
- [x] Login/Auth - ✅ PASS (with Playwright workaround)
- [ ] Navigation
- [x] Dashboard - ✅ PASS (displays correctly)
- [ ] PO List
- [ ] PO Create
- [ ] PO Details
- [ ] Approvals
- [ ] Admin - Users
- [ ] Admin - Items
- [ ] Admin - Suppliers
- [ ] Admin - Companies
- [ ] Admin - Characters

### Issues Summary:
- **Critical**: 0
- **Medium**: 1 (Playwright button click workaround)
- **Low**: 0
- **Fixed**: 1
- **Total**: 2
