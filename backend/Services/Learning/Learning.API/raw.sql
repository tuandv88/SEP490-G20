SELECT 
    conname AS constraint_name,
    confupdtype AS on_update,
    confdeltype AS on_delete,
    conrelid::regclass AS table_name,
    a.attname AS column_name,
    confrelid::regclass AS referenced_table,
    af.attname AS referenced_column
FROM 
    pg_constraint c
JOIN 
    pg_class t ON c.conrelid = t.oid
JOIN 
    pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = t.oid
JOIN 
    pg_class rt ON c.confrelid = rt.oid
JOIN 
    pg_attribute af ON af.attnum = ANY(c.confkey) AND af.attrelid = rt.oid
WHERE 
    contype = 'f';
