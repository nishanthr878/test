for index, row in df.iterrows():
    try:
        values = (
            row.get('Assetid'), row.get('SerialNo'), row.get('Brand'), row.get('Building'), row.get('Model'),
            row.get('POID'), row.get('Status'), row.get('Comments'), row.get('DOA'), row.get('username'),
            row.get('fullname'), row.get('email'), row.get('city'), row.get('deliveryfunction'), row.get('type'),
            row.get('Podate'), row.get('voucher'), row.get('lifespan'), row.get('tdate'), row.get('jump'),
            row.get('GRNDate1'), row.get('ReceiptID'), row.get('ReceiptDate'), row.get('GRNDate'),
            row.get('deliverydate'), row.get('store'), row.get('sez_date'), row.get('sez_renewal'),
            row.get('expiry'), row.get('engineername'), row.get('changeofloc'), row.get('hostnamechecker'),
            row.get('stop'), row.get('FARAssetID'), row.get('PAVVsFAR'), row.get('bonded_location'),
            row.get('wave'), row.get('ewaste'), row.get('SG_OS'), row.get('warranty'), row.get('reimage_date'),
            row.get('order_type'), row.get('allocated_status'), row.get('allocation_type'), row.get('rdpbuilding'),
            row.get('rdpworkstation'), row.get('nova_configured'), row.get('nova_configure_date'),
            row.get('invoice_no'), row.get('sez_approval_status'), row.get('emailid'), row.get('sez_unit'),
            row.get('boe'), row.get('sez_valid'), row.get('project'), row.get('hardware_serial'),
            row.get('dban_status'), row.get('dban_date'), row.get('ram')
        )

        placeholders = ', '.join(['%s'] * len(values))

        sql = f"""
            INSERT INTO public.laptop_archive (
                "Asset id", "Serial No", "Brand", "Building", "Model", "PO ID", "Status", "Comments", "DOA",
                username, fullname, email, city, "delivery function", type, "PO date", voucher, lifespan, tdate,
                jump, "GRN Date1", "Receipt ID", "Receipt Date", "GRN Date", "delivery date", store,
                sez_date, sez_renewal, expiry, engineername, changeofloc, hostnamechecker, stop,
                "FAR Asset ID", "PAVVsFAR", bonded_location, wave, ewaste, "SG_OS", warranty, reimage_date,
                order_type, allocated_status, allocation_type, rdpbuilding, rdpworkstation, nova_configured,
                nova_configure_date, invoice_no, sez_approval_status, emailid, sez_unit, boe, sez_valid,
                project, hardware_serial, dban_status, dban_date, ram
            ) VALUES ({placeholders})
        """

        curPostgress.execute(sql, values)

    except Exception as e:
        print(f"❌ Error at index {index}: {e}")
        print(f"👉 Row values: {values}")
        break  # Stop loop on first error
