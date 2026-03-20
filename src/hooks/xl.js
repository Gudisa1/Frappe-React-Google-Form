import * as XLSX from 'xlsx';

export const exportSubmissionToExcel = (submission) => {
  try {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    
    // Prepare metadata section
    const metadata = [
      ['Submission Details'],
      ['Project:', submission.project || 'N/A'],
      ['Form:', submission.reporting_form || 'N/A'],
      ['Status:', submission.status || 'N/A'],
      ['Submitted By:', submission.submitted_by || submission.owner || 'N/A'],
      ['Submission ID:', submission.name || 'N/A'],
      ['Created On:', submission.creation ? new Date(submission.creation).toLocaleString() : 'N/A'],
      [],
      ['SUBMITTED DATA'],
      []
    ];

    // ============================================
    // DYNAMIC GROUPING - NO HARDCODED VALUES
    // ============================================
    
    // Helper: extract the group identifier from field name (e.g., "1.1.1" from "1.1.1 – Field Name")
    const getGroupId = (fieldName) => {
      const match = fieldName.match(/^(\d+\.\d+\.\d+)/);
      return match ? match[1] : null;
    };

    // Helper: extract the base group (e.g., "1.1" from "1.1.1")
    const getBaseGroup = (groupId) => {
      const match = groupId.match(/^(\d+\.\d+)/);
      return match ? match[1] : null;
    };

    // Group fields dynamically by their ID
    const groupFieldsDynamically = (data) => {
      const groups = {};
      const otherFields = [];
      
      Object.entries(data || {}).forEach(([key, value]) => {
        const groupId = getGroupId(key);
        if (groupId) {
          if (!groups[groupId]) {
            groups[groupId] = [];
          }
          groups[groupId].push({ 
            field: key, 
            value: value !== null && value !== undefined ? value : 'N/A' 
          });
        } else {
          otherFields.push({ 
            field: key, 
            value: value !== null && value !== undefined ? value : 'N/A' 
          });
        }
      });
      
      return { groups, otherFields };
    };

    // Group the parsed data dynamically
    const { groups, otherFields } = groupFieldsDynamically(submission.parsedData || {});
    
    // Prepare worksheet data array
    const worksheetData = [...metadata];
    
    // Sort group keys naturally (1.1.1, 1.1.2, 1.1.3, 1.2.1, etc.)
    const sortedGroups = Object.keys(groups).sort((a, b) => {
      const partsA = a.split('.').map(Number);
      const partsB = b.split('.').map(Number);
      for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
        if (partsA[i] !== partsB[i]) return partsA[i] - partsB[i];
      }
      return partsA.length - partsB.length;
    });

    // Track current base group for potential sub-grouping
    let currentBaseGroup = null;
    
    // Add each group dynamically
    sortedGroups.forEach(groupId => {
      const baseGroup = getBaseGroup(groupId);
      
      // If this is a new base group, add a base group header (optional)
      if (baseGroup !== currentBaseGroup) {
        // You can optionally add a base group header here
        // worksheetData.push([`=== SECTION ${baseGroup} ===`, '']);
        currentBaseGroup = baseGroup;
      }
      
      // Add group header with just the group ID (no hardcoded description)
      worksheetData.push([`GROUP ${groupId}`, '']);
      
      // Sort fields within group (optional - they'll maintain original order)
      groups[groupId].forEach(item => {
        worksheetData.push([item.field, item.value]);
      });
      
      worksheetData.push([]); // Empty row after group
    });

    // Add other fields if any
    if (otherFields.length > 0) {
      worksheetData.push(['OTHER FIELDS', '']);
      otherFields.forEach(item => {
        worksheetData.push([item.field, item.value]);
      });
      worksheetData.push([]);
    }

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Style the worksheet
    ws['!cols'] = [
      { wch: 50 }, // Field column width - wider for Amharic text
      { wch: 20 }  // Value column width
    ];

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Submission Data');

    // Generate filename
    const fileName = `${submission.project || 'Submission'}_${submission.reporting_form || 'Form'}_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);

    console.log('Export successful:', fileName);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Failed to export to Excel. Please try again.');
  }
};

// Updated multiple submissions export with dynamic grouping
export const exportMultipleSubmissionsToExcel = (submissions) => {
  try {
    const wb = XLSX.utils.book_new();

    // ============================================
    // DYNAMIC GROUPING HELPER FUNCTIONS
    // ============================================
    const getGroupId = (fieldName) => {
      const match = fieldName.match(/^(\d+\.\d+\.\d+)/);
      return match ? match[1] : null;
    };

    const getBaseGroup = (groupId) => {
      const match = groupId.match(/^(\d+\.\d+)/);
      return match ? match[1] : null;
    };

    const groupFieldsDynamically = (data) => {
      const groups = {};
      const otherFields = [];
      
      Object.entries(data || {}).forEach(([key, value]) => {
        const groupId = getGroupId(key);
        if (groupId) {
          if (!groups[groupId]) {
            groups[groupId] = [];
          }
          groups[groupId].push({ 
            field: key, 
            value: value !== null && value !== undefined ? value : 'N/A' 
          });
        } else {
          otherFields.push({ 
            field: key, 
            value: value !== null && value !== undefined ? value : 'N/A' 
          });
        }
      });
      
      return { groups, otherFields };
    };

    submissions.forEach((submission, index) => {
      // Prepare metadata section
      const metadata = [
        ['SUBMISSION DETAILS'],
        ['Project:', submission.project || 'N/A'],
        ['Form:', submission.reporting_form || 'N/A'],
        ['Status:', submission.status || 'N/A'],
        ['Submitted By:', submission.submitted_by || submission.owner || 'N/A'],
        ['Submission ID:', submission.name || 'N/A'],
        ['Created On:', submission.creation ? new Date(submission.creation).toLocaleString() : 'N/A'],
        [],
        ['SUBMITTED DATA'],
        []
      ];

      // Group the parsed data dynamically
      const { groups, otherFields } = groupFieldsDynamically(submission.parsedData || {});
      
      // Prepare worksheet data array
      const worksheetData = [...metadata];
      
      // Sort group keys naturally
      const sortedGroups = Object.keys(groups).sort((a, b) => {
        const partsA = a.split('.').map(Number);
        const partsB = b.split('.').map(Number);
        for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
          if (partsA[i] !== partsB[i]) return partsA[i] - partsB[i];
        }
        return partsA.length - partsB.length;
      });

      // Add each group dynamically
      sortedGroups.forEach(groupId => {
        // Add group header with just the group ID
        worksheetData.push([`GROUP ${groupId}`, '']);
        
        // Add fields in this group
        groups[groupId].forEach(item => {
          worksheetData.push([item.field, item.value]);
        });
        
        worksheetData.push([]); // Empty row after group
      });

      // Add other fields if any
      if (otherFields.length > 0) {
        worksheetData.push(['OTHER FIELDS', '']);
        otherFields.forEach(item => {
          worksheetData.push([item.field, item.value]);
        });
        worksheetData.push([]);
      }

      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Set column widths
      ws['!cols'] = [
        { wch: 50 }, // Field column
        { wch: 20 }  // Value column
      ];
      
      // Add sheet with meaningful name
      const sheetName = `${submission.project || 'Submission'}_${index + 1}`.substring(0, 31);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    const fileName = `Submissions_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    console.log('Multiple submissions export successful');
  } catch (error) {
    console.error('Error exporting multiple submissions:', error);
    alert('Failed to export submissions to Excel.');
  }
};

























import { fetchSubmissionsByForm } from '../api/datacollection';

export const handleExportExcel = async (formName) => {
  try {
    const submissions = await fetchSubmissionsByForm(formName);
    if (!submissions.length) {
      alert("No submissions found for this form.");
      return;
    }

    // Group submissions by project
    const submissionsByProject = submissions.reduce((acc, sub) => {
      if (!acc[sub.project]) acc[sub.project] = [];
      acc[sub.project].push(sub);
      return acc;
    }, {});

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // ============================================
    // SIMPLE STYLING
    // ============================================
    const styles = {
      projectHeader: {
        font: { bold: true, sz: 14 },
        fill: { fgColor: { rgb: "70AD47" } }, // Green
        color: { rgb: "FFFFFF" },
        alignment: { horizontal: "center" }
      },
      submissionHeader: {
        font: { bold: true, sz: 12 },
        fill: { fgColor: { rgb: "4472C4" } }, // Blue
        color: { rgb: "FFFFFF" },
        alignment: { horizontal: "left" }
      },
      groupHeader: {
        font: { bold: true, sz: 11 },
        fill: { fgColor: { rgb: "FFC000" } }, // Orange for group headers
        color: { rgb: "000000" },
        alignment: { horizontal: "left" }
      },
      metadata: {
        font: { bold: true, sz: 10 },
        fill: { fgColor: { rgb: "D9E1F2" } }, // Light blue
        alignment: { horizontal: "left" }
      },
      field: {
        font: { sz: 10 },
        alignment: { horizontal: "left" }
      },
      value: {
        font: { sz: 10 },
        alignment: { horizontal: "right" }
      }
    };

    // ============================================
    // DYNAMIC GROUPING - NO HARDCODED VALUES
    // ============================================
    
    // Helper: extract the group identifier from field name (e.g., "1.1.1" from "1.1.1 – Field Name")
    const getGroupId = (fieldName) => {
      const match = fieldName.match(/^(\d+\.\d+\.\d+)/);
      return match ? match[1] : null;
    };

    // Helper: group fields dynamically by their ID
    const groupFieldsDynamically = (data) => {
      const groups = {};
      const otherFields = [];
      
      Object.entries(data || {}).forEach(([key, value]) => {
        const groupId = getGroupId(key);
        if (groupId) {
          if (!groups[groupId]) {
            groups[groupId] = [];
          }
          groups[groupId].push({ 
            field: key, 
            value: value !== null && value !== undefined ? value : '' 
          });
        } else {
          otherFields.push({ 
            field: key, 
            value: value !== null && value !== undefined ? value : '' 
          });
        }
      });
      
      return { groups, otherFields };
    };

    // ============================================
    // CREATE PROJECT SHEETS
    // ============================================
    Object.keys(submissionsByProject).forEach((projectName) => {
      const projectSubmissions = submissionsByProject[projectName];
      
      // Create array of arrays for rows
      const rows = [];

      // Project header
      rows.push([`PROJECT: ${projectName}`, `Total Submissions: ${projectSubmissions.length}`]);
      rows.push([]); // Empty row for spacing

      // Process each submission
      projectSubmissions.forEach((sub, subIndex) => {
        const parsedData = JSON.parse(sub.data || '{}');
        const { groups, otherFields } = groupFieldsDynamically(parsedData);

        // Submission header
        rows.push([`SUBMISSION ${subIndex + 1}`, '']);
        
        // Metadata
        rows.push(['Submission ID', sub.name]);
        rows.push(['Submitted By', sub.submitted_by]);
        rows.push(['Submission Date', new Date(sub.creation).toLocaleString()]);
        rows.push(['Status', sub.status]);
        rows.push(['Review Comment', sub.review_comment || '']);
        rows.push([]); // Empty row after metadata

        // Sort group keys naturally (1.1.1, 1.1.2, 1.1.3, 1.2.1, etc.)
        const sortedGroups = Object.keys(groups).sort((a, b) => {
          const partsA = a.split('.').map(Number);
          const partsB = b.split('.').map(Number);
          for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
            if (partsA[i] !== partsB[i]) return partsA[i] - partsB[i];
          }
          return partsA.length - partsB.length;
        });

        // Add each group dynamically (no hardcoded descriptions)
        sortedGroups.forEach(groupId => {
          // Simple group header with just the ID
          rows.push([`GROUP ${groupId}`, '']);
          
          // Add fields in this group
          groups[groupId].forEach(item => {
            rows.push([item.field, item.value]);
          });
          
          rows.push([]); // Empty row after group
        });

        // Other fields (if any)
        if (otherFields.length > 0) {
          rows.push(['OTHER FIELDS', '']);
          otherFields.forEach(item => {
            rows.push([item.field, item.value]);
          });
          rows.push([]); // Empty row after group
        }

        // Separator between submissions (2 empty rows)
        if (subIndex < projectSubmissions.length - 1) {
          rows.push([]);
          rows.push([]);
        }
      });

      // Convert rows array to worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      
      // Set column widths
      worksheet['!cols'] = [
        { wch: 55 }, // Field column - wider for Amharic text
        { wch: 20 }  // Value column
      ];

      // Apply styling
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
      
      for (let R = range.s.r; R <= range.e.r; R++) {
        const fieldCell = XLSX.utils.encode_cell({ r: R, c: 0 });
        const valueCell = XLSX.utils.encode_cell({ r: R, c: 1 });
        
        if (!worksheet[fieldCell]) continue;

        const fieldValue = worksheet[fieldCell].v;
        
        if (typeof fieldValue === 'string') {
          // Project header
          if (fieldValue.startsWith('PROJECT:')) {
            worksheet[fieldCell].s = styles.projectHeader;
            if (worksheet[valueCell]) worksheet[valueCell].s = styles.projectHeader;
          }
          // Submission header
          else if (fieldValue.startsWith('SUBMISSION')) {
            worksheet[fieldCell].s = styles.submissionHeader;
          }
          // Group headers (GROUP 1.1.1, GROUP 1.1.2, etc.)
          else if (fieldValue.startsWith('GROUP')) {
            worksheet[fieldCell].s = styles.groupHeader;
          }
          // Metadata fields
          else if (['Submission ID', 'Submitted By', 'Submission Date', 'Status', 'Review Comment'].includes(fieldValue)) {
            worksheet[fieldCell].s = styles.metadata;
            if (worksheet[valueCell]) worksheet[valueCell].s = styles.value;
          }
          // Regular fields
          else if (fieldValue && fieldValue !== '') {
            worksheet[fieldCell].s = styles.field;
            if (worksheet[valueCell]) worksheet[valueCell].s = styles.value;
          }
        }
      }

      // Sanitize sheet name
      const sheetName = projectName
        .substring(0, 31)
        .replace(/[\[\]:*?\/\\]/g, '_')
        .replace(/\s+/g, ' ')
        .trim() || 'Project';
      
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    // ============================================
    // SIMPLE SUMMARY SHEET (optional)
    // ============================================
    const summaryRows = [];
    
    // Simple header
    summaryRows.push(['Project', 'Submission', 'Group', 'Field', 'Value']);
    
    Object.keys(submissionsByProject).forEach((projectName) => {
      const projectSubmissions = submissionsByProject[projectName];
      
      projectSubmissions.forEach((sub, subIndex) => {
        const parsedData = JSON.parse(sub.data || '{}');
        const { groups } = groupFieldsDynamically(parsedData);
        
        Object.keys(groups).sort((a, b) => {
          const partsA = a.split('.').map(Number);
          const partsB = b.split('.').map(Number);
          for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
            if (partsA[i] !== partsB[i]) return partsA[i] - partsB[i];
          }
          return partsA.length - partsB.length;
        }).forEach(groupId => {
          groups[groupId].forEach(item => {
            summaryRows.push([
              projectName,
              `Sub ${subIndex + 1}`,
              groupId,
              item.field,
              item.value
            ]);
          });
        });
      });
    });

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
    
    summarySheet['!cols'] = [
      { wch: 15 }, // Project
      { wch: 10 }, // Submission
      { wch: 12 }, // Group
      { wch: 55 }, // Field
      { wch: 15 }  // Value
    ];
    
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'All Data');

    // ============================================
    // SAVE FILE
    // ============================================
    const date = new Date().toISOString().split('T')[0];
    const filename = `${formName.replace(/[^\w\s]/gi, '_')}_submissions_${date}.xlsx`;
    XLSX.writeFile(workbook, filename);

    console.log('Excel export completed successfully');
  } catch (error) {
    console.error('Excel export failed:', error);
    alert(`Failed to export Excel: ${error.message || 'Unknown error'}`);
  }
};

















// Format date for filename (e.g., 2024-01-15)
const getFormattedDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format condition for display in Excel
const formatCondition = (condition) => {
  const conditionMap = {
    'working': 'Working',
    'repair': 'Under Repair',
    'damaged': 'Damaged',
    'lost': 'Lost',
    'disposed': 'Disposed'
  };
  return conditionMap[condition?.toLowerCase()] || condition || 'Unknown';
};

// Prepare data for Excel export
const prepareExportData = (assets) => {
  if (!assets || assets.length === 0) return [];
  
  return assets.map(asset => ({
    'Asset ID': asset.asset_id || 'N/A',
    'Asset Code': asset.asset_code || 'N/A',
    'Asset Name': asset.asset_name || 'N/A',
    'Project': asset.project || 'N/A',
    'Asset Type': asset.asset_type || 'N/A',
    'Model': asset.model || 'N/A',
    'Serial Number': asset.serial_number || 'N/A',
    'Quantity': asset.quantity || 0,
    'Condition': formatCondition(asset.condition),
    'Notes': asset.notes || 'N/A',
    'Owner': asset.owner || 'N/A',
    'Created On': asset.creation ? new Date(asset.creation).toLocaleDateString() : 'N/A',
    'Last Modified': asset.modified ? new Date(asset.modified).toLocaleDateString() : 'N/A'
  }));
};

// ============================================
// FUNCTION 1: Export filtered assets to Excel
// ============================================
export const exportAssetsToExcel = (assets, filters, searchTerm) => {
  console.log('🚀 Exporting assets to Excel...', { 
    assetCount: assets.length, 
    filters, 
    searchTerm 
  });
  
  try {
    // Validate assets
    if (!assets || assets.length === 0) {
      alert('No assets to export. The list is empty.');
      return false;
    }

    // Prepare the data for export
    const exportData = prepareExportData(assets);
    
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Convert JSON to worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Assets');
    
    // Generate filename with filter information
    let filterInfo = '';
    if (filters.project !== 'all') filterInfo += `_${filters.project}`;
    if (filters.assetType !== 'all') filterInfo += `_${filters.assetType}`;
    if (filters.condition !== 'all') filterInfo += `_${filters.condition}`;
    if (searchTerm) filterInfo += `_search`;
    
    // If no filters applied, use 'all'
    if (!filterInfo) filterInfo = '_all';
    
    const fileName = `assets_export${filterInfo}_${getFormattedDate()}.xlsx`;
    
    // Save the file
    XLSX.writeFile(wb, fileName);
    
    console.log('✅ Export successful!', fileName);
    alert(`✅ Successfully exported ${assets.length} assets to Excel!`);
    return true;
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    alert('Export failed: ' + error.message);
    return false;
  }
};

// ============================================
// FUNCTION 2: Generate Summary Report
// ============================================
export const exportSummaryToExcel = (assets, filters, searchTerm) => {
  console.log('🚀 Generating summary report...', { 
    assetCount: assets.length, 
    filters, 
    searchTerm 
  });
  
  try {
    // Validate assets
    if (!assets || assets.length === 0) {
      alert('No assets to generate summary. The list is empty.');
      return false;
    }

    // Calculate summary statistics
    const totalAssets = assets.length;
    const working = assets.filter(a => a.condition?.toLowerCase() === 'working').length;
    const repair = assets.filter(a => a.condition?.toLowerCase() === 'repair').length;
    const damaged = assets.filter(a => a.condition?.toLowerCase() === 'damaged').length;
    const lost = assets.filter(a => a.condition?.toLowerCase() === 'lost').length;
    const disposed = assets.filter(a => a.condition?.toLowerCase() === 'disposed').length;
    
    // Get unique projects and their counts
    const projectCounts = {};
    assets.forEach(asset => {
      if (asset.project) {
        projectCounts[asset.project] = (projectCounts[asset.project] || 0) + 1;
      }
    });
    
    // Get unique asset types and their counts
    const typeCounts = {};
    assets.forEach(asset => {
      if (asset.asset_type) {
        typeCounts[asset.asset_type] = (typeCounts[asset.asset_type] || 0) + 1;
      }
    });

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // ===== SHEET 1: Executive Summary =====
    const summaryData = [
      ['ASSET MANAGEMENT EXECUTIVE SUMMARY'],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['APPLIED FILTERS'],
      ['Project:', filters.project !== 'all' ? filters.project : 'All Projects'],
      ['Asset Type:', filters.assetType !== 'all' ? filters.assetType : 'All Types'],
      ['Condition:', filters.condition !== 'all' ? filters.condition : 'All Conditions'],
      ['Search Term:', searchTerm || 'None'],
      [],
      ['OVERALL STATISTICS'],
      ['Total Assets', totalAssets],
      ['Total Unique Projects', Object.keys(projectCounts).length],
      ['Total Asset Types', Object.keys(typeCounts).length],
      [],
      ['ASSETS BY CONDITION'],
      ['Working', working, `${((working/totalAssets)*100).toFixed(1)}%`],
      ['Under Repair', repair, `${((repair/totalAssets)*100).toFixed(1)}%`],
      ['Damaged', damaged, `${((damaged/totalAssets)*100).toFixed(1)}%`],
      ['Lost', lost, `${((lost/totalAssets)*100).toFixed(1)}%`],
      ['Disposed', disposed, `${((disposed/totalAssets)*100).toFixed(1)}%`]
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Executive Summary');

    // ===== SHEET 2: Assets by Project =====
    const projectData = [
      ['ASSETS BY PROJECT'],
      ['Project', 'Number of Assets', 'Percentage']
    ];
    
    Object.entries(projectCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([project, count]) => {
        projectData.push([
          project, 
          count, 
          `${((count / totalAssets) * 100).toFixed(1)}%`
        ]);
      });
    
    projectData.push(['TOTAL', totalAssets, '100%']);
    
    const projectWs = XLSX.utils.aoa_to_sheet(projectData);
    XLSX.utils.book_append_sheet(wb, projectWs, 'By Project');

    // ===== SHEET 3: Assets by Type =====
    const typeData = [
      ['ASSETS BY TYPE'],
      ['Asset Type', 'Number of Assets', 'Percentage']
    ];
    
    Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        typeData.push([
          type, 
          count, 
          `${((count / totalAssets) * 100).toFixed(1)}%`
        ]);
      });
    
    typeData.push(['TOTAL', totalAssets, '100%']);
    
    const typeWs = XLSX.utils.aoa_to_sheet(typeData);
    XLSX.utils.book_append_sheet(wb, typeWs, 'By Type');

    // ===== SHEET 4: Detailed Asset List =====
    const exportData = prepareExportData(assets);
    const detailsWs = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, detailsWs, 'Detailed Assets');

    // ===== SHEET 5: Assets Needing Attention (Damaged/Repair) =====
    const attentionAssets = assets.filter(a => 
      a.condition?.toLowerCase() === 'damaged' || 
      a.condition?.toLowerCase() === 'repair'
    );
    
    if (attentionAssets.length > 0) {
      const attentionData = attentionAssets.map(asset => ({
        'Asset ID': asset.asset_id || 'N/A',
        'Asset Name': asset.asset_name || 'N/A',
        'Project': asset.project || 'N/A',
        'Condition': formatCondition(asset.condition),
        'Model': asset.model || 'N/A',
        'Serial Number': asset.serial_number || 'N/A',
        'Notes': asset.notes || 'N/A'
      }));
      
      const attentionWs = XLSX.utils.json_to_sheet(attentionData);
      XLSX.utils.book_append_sheet(wb, attentionWs, 'Needs Attention');
    }

    // Save the file
    const fileName = `asset_summary_report_${getFormattedDate()}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    console.log('✅ Summary report generated successfully!', fileName);
    alert(`✅ Successfully generated summary report for ${assets.length} assets!`);
    return true;
    
  } catch (error) {
    console.error('❌ Summary export failed:', error);
    alert('Summary export failed: ' + error.message);
    return false;
  }
};

// ============================================
// BONUS: Export as CSV (alternative format)
// ============================================
export const exportAssetsToCSV = (assets, filters, searchTerm) => {
  try {
    if (!assets || assets.length === 0) {
      alert('No assets to export');
      return false;
    }

    // Prepare headers
    const headers = ['Asset ID', 'Asset Code', 'Asset Name', 'Project', 'Type', 'Model', 'Serial Number', 'Quantity', 'Condition', 'Notes'];
    
    // Prepare rows
    const rows = assets.map(asset => [
      asset.asset_id || 'N/A',
      asset.asset_code || 'N/A',
      asset.asset_name || 'N/A',
      asset.project || 'N/A',
      asset.asset_type || 'N/A',
      asset.model || 'N/A',
      asset.serial_number || 'N/A',
      asset.quantity || 0,
      formatCondition(asset.condition),
      asset.notes || 'N/A'
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    let filterInfo = '';
    if (filters.project !== 'all') filterInfo += `_${filters.project}`;
    if (filters.assetType !== 'all') filterInfo += `_${filters.assetType}`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', `assets_export${filterInfo || '_all'}_${getFormattedDate()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`✅ Successfully exported ${assets.length} assets to CSV!`);
    return true;
  } catch (error) {
    console.error('❌ CSV export failed:', error);
    alert('CSV export failed: ' + error.message);
    return false;
  }
};
