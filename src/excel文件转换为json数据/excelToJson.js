/**
 * Excel转JSON工具类
 * 使用SheetJS库读取Excel文件并转换为JSON格式
 * 
 * 依赖: https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
 */

class ExcelToJsonConverter {
    /**
     * 读取Excel文件并转换为JSON
     * @param {File} file - Excel文件对象
     * @param {Object} options - 配置选项
     * @param {string} options.sheetName - 指定工作表名称，默认为第一个工作表
     * @param {string} options.range - 指定读取范围，如"A1:C10"
     * @param {string} options.defval - 空单元格的默认值，默认为空字符串
     * @returns {Promise<Object>} 返回包含JSON数据的Promise
     */
    static async readExcelToJson(file, options = {}) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('请选择一个Excel文件'));
                return;
            }

            // 检查SheetJS是否已加载
            if (typeof XLSX === 'undefined') {
                reject(new Error('SheetJS库未加载，请先引入XLSX库'));
                return;
            }

            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const data = e.target.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    
                    // 获取工作表名称
                    const sheetName = options.sheetName || workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    
                    if (!worksheet) {
                        reject(new Error(`工作表 "${sheetName}" 不存在`));
                        return;
                    }

                    // 设置读取范围
                    let range = options.range;
                    if (!range && worksheet['!ref']) {
                        range = worksheet['!ref'];
                    }

                    // 转换为JSON - 始终将第一行作为表头（key值）
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                        range: range,
                        defval: options.defval || ''
                        // 不设置header参数，默认将第一行作为表头
                    });

                    resolve({
                        sheetName: sheetName,
                        data: jsonData,
                        totalRows: jsonData.length,
                        totalCols: jsonData.length > 0 ? Object.keys(jsonData[0]).length : 0,
                        allSheets: workbook.SheetNames
                    });
                } catch (error) {
                    reject(new Error(`读取Excel文件失败: ${error.message}`));
                }
            };

            reader.onerror = function() {
                reject(new Error('文件读取失败'));
            };

            // 以二进制方式读取文件
            reader.readAsBinaryString(file);
        });
    }

    /**
     * 简化的Excel转JSON方法
     * @param {File} file - Excel文件对象
     * @returns {Promise<Array>} 返回JSON数组
     */
    static async excelToJson(file) {
        const result = await this.readExcelToJson(file);
        return result.data;
    }

    /**
     * 读取多个工作表
     * @param {File} file - Excel文件对象
     * @param {Object} options - 配置选项
     * @returns {Promise<Object>} 返回包含所有工作表数据的对象
     */
    static async readAllSheets(file, options = {}) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('请选择一个Excel文件'));
                return;
            }

            if (typeof XLSX === 'undefined') {
                reject(new Error('SheetJS库未加载，请先引入XLSX库'));
                return;
            }

            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const data = e.target.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const result = {};

                    workbook.SheetNames.forEach(sheetName => {
                        const worksheet = workbook.Sheets[sheetName];
                        result[sheetName] = XLSX.utils.sheet_to_json(worksheet, { 
                            defval: options.defval || ''
                            // 不设置header参数，默认将第一行作为表头
                        });
                    });

                    resolve({
                        sheets: result,
                        sheetNames: workbook.SheetNames,
                        totalSheets: workbook.SheetNames.length
                    });
                } catch (error) {
                    reject(new Error(`读取Excel文件失败: ${error.message}`));
                }
            };

            reader.onerror = function() {
                reject(new Error('文件读取失败'));
            };

            reader.readAsBinaryString(file);
        });
    }

    /**
     * 从URL读取Excel文件
     * @param {string} url - Excel文件的URL
     * @param {Object} options - 配置选项
     * @returns {Promise<Object>} 返回包含JSON数据的Promise
     */
    static async readExcelFromUrl(url, options = {}) {
        return new Promise((resolve, reject) => {
            if (typeof XLSX === 'undefined') {
                reject(new Error('SheetJS库未加载，请先引入XLSX库'));
                return;
            }

            fetch(url)
                .then(response => response.arrayBuffer())
                .then(data => {
                    try {
                        const workbook = XLSX.read(data, { type: 'array' });
                        
                        const sheetName = options.sheetName || workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];
                        
                        if (!worksheet) {
                            reject(new Error(`工作表 "${sheetName}" 不存在`));
                            return;
                        }

                        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                            defval: options.defval || ''
                            // 不设置header参数，默认将第一行作为表头
                        });

                        resolve({
                            sheetName: sheetName,
                            data: jsonData,
                            totalRows: jsonData.length,
                            totalCols: jsonData.length > 0 ? Object.keys(jsonData[0]).length : 0
                        });
                    } catch (error) {
                        reject(new Error(`解析Excel文件失败: ${error.message}`));
                    }
                })
                .catch(error => {
                    reject(new Error(`下载Excel文件失败: ${error.message}`));
                });
        });
    }
}

// 导出函数（兼容不同的模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExcelToJsonConverter;
} else if (typeof define === 'function' && define.amd) {
    define([], function() {
        return ExcelToJsonConverter;
    });
} else {
    window.ExcelToJsonConverter = ExcelToJsonConverter;
}

// 使用示例
/*
// 1. 基本用法
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];

ExcelToJsonConverter.excelToJson(file)
    .then(data => {
        console.log('转换结果:', data);
    })
    .catch(error => {
        console.error('转换失败:', error);
    });

// 2. 高级用法
ExcelToJsonConverter.readExcelToJson(file, {
    sheetName: 'Sheet1',
    headerRow: true,
    range: 'A1:E100',
    defval: 'N/A'
})
.then(result => {
    console.log('工作表:', result.sheetName);
    console.log('数据:', result.data);
    console.log('总行数:', result.totalRows);
});

// 3. 读取所有工作表
ExcelToJsonConverter.readAllSheets(file)
    .then(result => {
        console.log('所有工作表:', result.sheets);
        console.log('工作表名称:', result.sheetNames);
    });

// 4. 从URL读取
ExcelToJsonConverter.readExcelFromUrl('path/to/file.xlsx')
    .then(result => {
        console.log('从URL读取的数据:', result.data);
    });
*/
