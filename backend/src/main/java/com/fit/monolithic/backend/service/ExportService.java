package com.fit.monolithic.backend.service;

import java.io.ByteArrayInputStream;

public interface ExportService {
    ByteArrayInputStream exportOrdersToExcel();
    ByteArrayInputStream exportInventoryToExcel();
}
