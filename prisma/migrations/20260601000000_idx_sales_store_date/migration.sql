CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sales_store_date
    ON "sales" ("storeId", "saleDateUtc");
