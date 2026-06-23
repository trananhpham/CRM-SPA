TYPE=TRIGGERS
triggers='CREATE DEFINER=`root`@`localhost` TRIGGER trg_after_insert_payments\nAFTER INSERT ON payments\nFOR EACH ROW\nBEGIN\n    IF NEW.payment_status = \'PAID\'\n       AND NEW.payment_type = \'PACKAGE_PREPAID\'\n       AND NEW.customer_package_id IS NOT NULL THEN\n\n        UPDATE customer_packages\n        SET paid_amount = paid_amount + NEW.amount\n        WHERE customer_package_id = NEW.customer_package_id;\n\n    END IF;\nEND'
sql_modes=1411383304
definers='root@localhost'
client_cs_names='utf8mb4'
connection_cl_names='utf8mb4_uca1400_ai_ci'
db_cl_names='utf8mb4_unicode_ci'
created=1782244009028442
sql_path='CURRENT_SCHEMA'
