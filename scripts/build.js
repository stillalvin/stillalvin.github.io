#!/usr/bin/env node

/**
 * Build script for Alvin's Portfolio
 * This script helps with development and deployment tasks
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
    minNodeVersion: '14.0.0',
    requiredDependencies: ['three.js', 'gsap', 'font-awesome'],
    maxImageSize: 10 * 1024 * 1024, // 10mb
    environments: ['development', 'production']
};

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileStructure() {
    log('\n🔍 Checking file structure...', 'cyan');
    
    const requiredFiles = [
        'index.html',
        'script.js',
        'styles/main.css',
        'styles/base.css',
        'styles/components.css',
        'js/navigation.js',
        'js/three-background.js',
        'js/projects.js',
        'js/contact.js',
        'js/floating-contact.js',
        'package.json',
        'server.js',
        'assets/images'
    ];
    
    const missingFiles = [];
    
    requiredFiles.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
            if (fs.statSync(filePath).isDirectory()) {
                const files = fs.readdirSync(filePath);
                if (files.length === 0) {
                    log(`⚠️  ${file} - EMPTY DIRECTORY`, 'yellow');
                    missingFiles.push(`${file} (empty)`);
                } else {
                    log(`✅ ${file} (${files.length} files)`, 'green');
                }
            } else {
                log(`✅ ${file}`, 'green');
            }
        } else {
            log(`❌ ${file} - MISSING`, 'red');
            missingFiles.push(file);
        }
    });
    
    if (missingFiles.length > 0) {
        log(`\n⚠️  Found ${missingFiles.length} issues:`, 'yellow');
        missingFiles.forEach(file => log(`   - ${file}`, 'red'));
        return false;
    }
    
    log('\n✅ All required files are present and valid!', 'green');
    return true;
}

function validateHTML() {
    log('\n🔍 Validating HTML structure...', 'cyan');
    
    try {
        const htmlContent = fs.readFileSync('index.html', 'utf8');
        
        // Check for required script tags
        const requiredScripts = [
            'js/navigation.js',
            'js/three-background.js',
            'js/projects.js',
            'js/contact.js',
            'js/floating-contact.js'
        ];
        
        const missingScripts = [];
        
        requiredScripts.forEach(script => {
            if (htmlContent.includes(script)) {
                log(`✅ ${script} included`, 'green');
            } else {
                log(`❌ ${script} - NOT INCLUDED`, 'red');
                missingScripts.push(script);
            }
        });
        
        // Check for CSS import
        if (htmlContent.includes('styles/main.css')) {
            log('✅ Main CSS file included', 'green');
        } else {
            log('❌ Main CSS file - NOT INCLUDED', 'red');
            missingScripts.push('styles/main.css');
        }
        
        if (missingScripts.length > 0) {
            log(`\n⚠️  Missing ${missingScripts.length} required includes!`, 'yellow');
            return false;
        }
        
        log('\n✅ HTML structure is valid!', 'green');
        return true;
    } catch (error) {
        log(`❌ Error reading HTML file: ${error.message}`, 'red');
        return false;
    }
}

function checkForDuplicates() {
    log('\n🔍 Checking for duplicate code...', 'cyan');
    
    try {
        const scriptContent = fs.readFileSync('script.js', 'utf8');
        const navigationContent = fs.readFileSync('js/navigation.js', 'utf8');
        const contactContent = fs.readFileSync('js/contact.js', 'utf8');
        const projectsContent = fs.readFileSync('js/projects.js', 'utf8');
        
        // Check for common duplicate patterns
        const duplicates = [];
        
        // Check for navigation code in main script
        if (scriptContent.includes('navToggle.addEventListener') && navigationContent.includes('navToggle.addEventListener')) {
            duplicates.push('Navigation code duplicated between script.js and navigation.js');
        }
        
        // Check for contact form code in main script
        if (scriptContent.includes('contactForm.addEventListener') && contactContent.includes('contactForm.addEventListener')) {
            duplicates.push('Contact form code duplicated between script.js and contact.js');
        }
        
        // Check for project code in main script
        if (scriptContent.includes('createProjectCards') && projectsContent.includes('createProjectCards')) {
            duplicates.push('Project code duplicated between script.js and projects.js');
        }
        
        if (duplicates.length > 0) {
            log('\n⚠️  Found duplicate code:', 'yellow');
            duplicates.forEach(duplicate => {
                log(`   - ${duplicate}`, 'red');
            });
            return false;
        }
        
        log('✅ No duplicate code found!', 'green');
        return true;
    } catch (error) {
        log(`❌ Error checking for duplicates: ${error.message}`, 'red');
        return false;
    }
}

function checkDependencies() {
    log('\n🔍 Checking dependencies...', 'cyan');
    
    // Check Node.js version
    const nodeVersion = process.version.slice(1);
    if (nodeVersion < config.minNodeVersion) {
        log(`❌ Node.js version ${nodeVersion} is below minimum required version ${config.minNodeVersion}`, 'red');
        return false;
    }
    log(`✅ Node.js version ${nodeVersion}`, 'green');

    // Check required CDN dependencies in HTML
    try {
        const htmlContent = fs.readFileSync('index.html', 'utf8');
        const missingDeps = [];
        
        config.requiredDependencies.forEach(dep => {
            if (!htmlContent.includes(dep)) {
                missingDeps.push(dep);
            }
        });
        
        if (missingDeps.length > 0) {
            log(`❌ Missing dependencies: ${missingDeps.join(', ')}`, 'red');
            return false;
        }
        log('✅ All required dependencies are present', 'green');
        return true;
    } catch (error) {
        log(`❌ Error checking dependencies: ${error.message}`, 'red');
        return false;
    }
}

function checkImageSizes() {
    log('\n🔍 Checking image sizes...', 'cyan');
    const imageDir = path.join(process.cwd(), 'assets/images');
    const largeImages = [];
    
    function checkImagesInDir(dir) {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                checkImagesInDir(filePath);
            } else if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
                const stats = fs.statSync(filePath);
                if (stats.size > config.maxImageSize) {
                    largeImages.push({
                        file: path.relative(imageDir, filePath),
                        size: Math.round(stats.size / 1024) + 'KB'
                    });
                }
            }
        });
    }
    
    try {
        checkImagesInDir(imageDir);
        
        if (largeImages.length > 0) {
            log('⚠️  Large images found:', 'yellow');
            largeImages.forEach(img => {
                log(`   - ${img.file} (${img.size})`, 'yellow');
            });
            return false;
        }
        
        log('✅ All images are within size limits', 'green');
        return true;
    } catch (error) {
        log(`❌ Error checking image sizes: ${error.message}`, 'red');
        return false;
    }
}

function validateCSS() {
    log('\n🔍 Validating CSS...', 'cyan');
    const cssFiles = [
        'styles/main.css',
        'styles/base.css',
        'styles/components.css'
    ];
    
    let isValid = true;
    
    cssFiles.forEach(file => {
        try {
            const css = fs.readFileSync(file, 'utf8');
            
            // Basic CSS validation checks
            const errors = [];
            
            // Check for unclosed braces
            const openBraces = (css.match(/{/g) || []).length;
            const closeBraces = (css.match(/}/g) || []).length;
            if (openBraces !== closeBraces) {
                errors.push(`Mismatched braces: ${openBraces} opening vs ${closeBraces} closing`);
            }
            
            // Check for missing semicolons
            const declarations = css.match(/[^;{}]+(?=})/g);
            if (declarations) {
                declarations.forEach(dec => {
                    if (dec.trim() && !dec.includes(':')) {
                        errors.push(`Possible missing semicolon before: "${dec.trim()}"`);
                    }
                });
            }
            
            if (errors.length > 0) {
                log(`❌ ${file}:`, 'red');
                errors.forEach(error => log(`   - ${error}`, 'red'));
                isValid = false;
            } else {
                log(`✅ ${file}`, 'green');
            }
        } catch (error) {
            log(`❌ Error reading ${file}: ${error.message}`, 'red');
            isValid = false;
        }
    });
    
    return isValid;
}

function cleanup() {
    log('\n🧹 Cleaning up...', 'cyan');
    const tempFiles = ['.DS_Store', 'Thumbs.db', '*.log'];
    let cleaned = 0;
    
    try {
        const walk = (dir) => {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const filePath = path.join(dir, file);
                if (fs.statSync(filePath).isDirectory()) {
                    walk(filePath);
                } else if (tempFiles.some(pattern => 
                    new RegExp('^' + pattern.replace(/\*/g, '.*') + '$').test(file)
                )) {
                    fs.unlinkSync(filePath);
                    cleaned++;
                    log(`   - Removed: ${path.relative(process.cwd(), filePath)}`, 'yellow');
                }
            });
        };
        
        walk(process.cwd());
        log(`✅ Cleaned up ${cleaned} temporary files`, 'green');
        return true;
    } catch (error) {
        log(`❌ Error during cleanup: ${error.message}`, 'red');
        return false;
    }
}

function main() {
    log('🚀 Alvin\'s Portfolio - Build Check', 'bright');
    log('=====================================', 'bright');
    
    const checks = [
        checkFileStructure,
        validateHTML,
        validateCSS,
        checkDependencies,
        checkImageSizes,
        checkForDuplicates,
        cleanup
    ];
    
    let allPassed = true;
    let startTime = Date.now();
    
    checks.forEach(check => {
        if (!check()) {
            allPassed = false;
        }
    });
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    if (allPassed) {
        log(`\n🎉 All checks passed! (${duration}s)`, 'green');
        log('💡 Run "npm start" to start the development server.', 'cyan');
    } else {
        log(`\n❌ Some checks failed. Please fix the issues above. (${duration}s)`, 'red');
        process.exit(1);
    }
}

// Run the build check
if (require.main === module) {
    main();
}

module.exports = {
    checkFileStructure,
    validateHTML,
    checkForDuplicates
}; 