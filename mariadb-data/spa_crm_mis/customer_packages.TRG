TYPE=TRIGGERS
triggers='CREATE DEFINER=`root`@`localhost` TRIGGER trg_before_insert_customer_packages\nBEFORE INSERT ON customer_packages\nFOR EACH ROW\nBEGIN\n    DECLARE v_validity_days INT;\n    DECLARE v_package_price DECIMAL(12,2);\n\n    SELECT validity_days, package_price\n    INTO v_validity_days, v_package_price\n    FROM packages\n    WHERE package_id = NEW.package_id;\n\n    IF NEW.expiry_date IS NULL THEN\n        SET NEW.expiry_date = DATE_ADD(NEW.purchase_date, INTERVAL v_validity_days DAY);\n    END IF;\n\n    IF NEW.purchase_amount = 0 THEN\n        SET NEW.purchase_amount = v_package_price;\n    END IF;\nEND' 'CREATE DEFINER=`root`@`localhost` TRIGGER trg_after_insert_customer_packages\nAFTER INSERT ON customer_packages\nFOR EACH ROW\nBEGIN\n    INSERT INTO customer_package_items (\n        customer_package_id,\n        service_id,\n        total_sessions,\n        revenue_per_session\n    )\n    SELECT\n        NEW.customer_package_id,\n        service_id,\n        included_sessions,\n        revenue_per_session\n    FROM package_items\n    WHERE package_id = NEW.package_id;\nEND'
sql_modes=1411383304 1411383304
definers='root@localhost' 'root@localhost'
client_cs_names='utf8mb4' 'utf8mb4'
connection_cl_names='utf8mb4_uca1400_ai_ci' 'utf8mb4_uca1400_ai_ci'
db_cl_names='utf8mb4_unicode_ci' 'utf8mb4_unicode_ci'
created=1782244009007696 1782244009013483
sql_path='CURRENT_SCHEMA' 'CURRENT_SCHEMA'
