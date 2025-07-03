Sub MailMergeToPdfStrictReference_Debug()
    ' Disable screen updating and alerts for performance
    Application.ScreenUpdating = False
    Application.DisplayAlerts = wdAlertsNone

    Dim masterDoc As Document, singleDoc As Document
    Dim lastRecordNum As Long, i As Integer
    Dim refNumber As String, fieldExists As Boolean
    Dim isNumixLetterhead As Boolean
    Dim startTime As Single ' For performance timing

    Set masterDoc = ActiveDocument

    ' 1. Verify data source
    If masterDoc.MailMerge.DataSource.RecordCount <= 0 Then
        MsgBox "No records found in data source!", vbExclamation
        Exit Sub
    End If

    ' 2. Check if fields exist
    fieldExists = False
    For i = 1 To masterDoc.MailMerge.DataSource.FieldNames.Count
        If masterDoc.MailMerge.DataSource.FieldNames(i) = "Numix_reference_num" Then
            fieldExists = True
            Exit For
        End If
    Next

    If Not fieldExists Then
        MsgBox "Cannot find 'Numix reference num' field." & vbCrLf & _
               "Available fields: " & GetMergeFieldNames(masterDoc), vbCritical
        Exit Sub
    End If

    ' 3. Determine letterhead type
    isNumixLetterhead = (InStr(1, masterDoc.Name, "Numix", vbTextCompare) > 0)
    Debug.Print "Using letterhead: " & IIf(isNumixLetterhead, "Numix", "EZ4U")

    ' 4. Process records
    lastRecordNum = masterDoc.MailMerge.DataSource.RecordCount ' Get total records
    masterDoc.MailMerge.Destination = wdSendToNewDocument ' Set destination once before the loop

    startTime = Timer ' Start timing

    Dim k As Long ' Loop counter for records
    For k = 1 To lastRecordNum
        masterDoc.MailMerge.DataSource.ActiveRecord = k ' Set current record

        ' 5. Get reference number with error handling
        On Error Resume Next
        If isNumixLetterhead Then
            refNumber = masterDoc.MailMerge.DataSource.DataFields("Numix_reference_num").Value
        Else
            refNumber = masterDoc.MailMerge.DataSource.DataFields("EZ4U_reference_num").Value
        End If

        If Err.Number <> 0 Then
            Debug.Print "Error accessing reference number field in record " & _
                       masterDoc.MailMerge.DataSource.ActiveRecord & _
                       " (Attempted field: '" & IIf(isNumixLetterhead, "Numix_reference_num", "EZ4U_reference_num") & "'). Error: " & Err.Description
            Err.Clear
            GoTo SkipRecord ' Skip to next record iteration
        End If
        On Error GoTo 0 ' Reset error handling

        ' 6. Clean and validate reference number
        refNumber = Trim(CStr(refNumber)) ' CStr is important if .Value might not be text
        Debug.Print "Record " & masterDoc.MailMerge.DataSource.ActiveRecord & _
                   ": '" & refNumber & "'" & _
                   " (Length: " & Len(refNumber) & ")"

        If refNumber = "" Or Len(refNumber) < 2 Then
            Debug.Print "Skipping - Invalid reference"
            GoTo SkipRecord
        End If

        ' 7. PROCESS VALID RECORD
        Debug.Print "Processing record with valid reference"
        masterDoc.MailMerge.DataSource.FirstRecord = masterDoc.MailMerge.DataSource.ActiveRecord
        masterDoc.MailMerge.DataSource.LastRecord = masterDoc.MailMerge.DataSource.ActiveRecord
        masterDoc.MailMerge.Execute False

        Set singleDoc = ActiveDocument
        singleDoc.SaveAs2 _
            FileName:=masterDoc.MailMerge.DataSource.DataFields("DocFolderPath").Value & _
                Application.PathSeparator & _
                masterDoc.MailMerge.DataSource.DataFields("DocFileName").Value & ".docx", _
            FileFormat:=wdFormatXMLDocument

        singleDoc.ExportAsFixedFormat _
            OutputFileName:=masterDoc.MailMerge.DataSource.DataFields("PdfFolderPath").Value & _
                Application.PathSeparator & _
                masterDoc.MailMerge.DataSource.DataFields("PdfFileName").Value & ".pdf", _
            ExportFormat:=wdExportFormatPDF

        singleDoc.Close False
        Debug.Print "Successfully processed"

SkipRecord:
        ' This label is now jumped to from within the loop, loop continues with Next k
    Next k ' Move to the next record

    Debug.Print "Total processing time: " & Format(Timer - startTime, "0.00") & " seconds." ' Output total time
    MsgBox "Process completed. Check Immediate Window (Ctrl+G) for details.", vbInformation

    ' Restore screen updating and alerts
    Application.ScreenUpdating = True
    Application.DisplayAlerts = wdAlertsAll
End Sub

Function GetMergeFieldNames(doc As Document) As String
    Dim i As Integer
    Dim fieldList As String
    For i = 1 To doc.MailMerge.DataSource.FieldNames.Count
        fieldList = fieldList & doc.MailMerge.DataSource.FieldNames(i) & ", "
    Next
    GetMergeFieldNames = Left(fieldList, Len(fieldList) - 2)
End Function
