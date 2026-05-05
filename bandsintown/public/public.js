/**
 * Convert RGBA/RGB color to hex format
 * @param {string} rgba - RGBA or RGB color string
 * @return {string} Hex color string (e.g., '#ffffff')
 */
function rgbaToHex(rgba) {
    // Match rgba(r, g, b, a) or rgb(r, g, b)
    var match = rgba.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)/);
    
    if (!match) {
        return rgba; // Return original if not valid RGBA/RGB
    }
    
    var r = parseInt(match[1]);
    var g = parseInt(match[2]);
    var b = parseInt(match[3]);
    
    // Convert to hex
    var hex = '#' + 
        ('0' + r.toString(16)).slice(-2) + 
        ('0' + g.toString(16)).slice(-2) + 
        ('0' + b.toString(16)).slice(-2);
    
    return hex;
}

/**
 * Enhance element settings with dynamic show/hide or value synchronization
 * @param {Object|Array} element_ids - Either:
 *   1. Object for visibility control: {
 *        controller: 'id-of-controlling-element',
 *        dependents: ['id-1', 'id-2'],
 *        showWhen: 'value-to-show-dependents' (optional)
 *      }
 *   2. Array of element IDs to synchronize with current element's value: ['id-1', 'id-2', 'id-3']
 */
function enhanceElementSettings(element_ids) {
    // Check if element_ids is an array (value synchronization mode)
    if (Array.isArray(element_ids)) {
        // Get the current element that triggered the change (using 'this' context when called inline)
        var sourceElement = this && this.id ? this : null;
        
        if (!sourceElement) {
            // If not called with 'this' context, try to find from event
            console.warn('enhanceElementSettings: Array mode requires element context');
            return false;
        }
        
        // Synchronize values to all target elements
        var sourceValue = sourceElement.value;
        
        // Convert color values to hex if the source is a color input
        var isColorField = sourceElement.type === 'color' || sourceElement.classList.contains('color-picker-input') || sourceElement.id.includes('color');
        
        if (isColorField && sourceValue) {
            // Convert RGBA to hex if needed
            if (sourceValue.indexOf('rgba') === 0 || sourceValue.indexOf('rgb') === 0) {
                sourceValue = rgbaToHex(sourceValue);
            }
        }
        
        element_ids.forEach(function(targetId) {
            var targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.value = sourceValue;
                
                // Trigger change event on target element to update any dependencies
                var changeEvent = new Event('change', { bubbles: true });
                targetElement.dispatchEvent(changeEvent);
            } else {
                console.warn('enhanceElementSettings: Target element not found:', targetId);
            }
        });
        
        return true;
    }
    
    // Object mode - visibility control (original functionality)
    if (!element_ids || !element_ids.controller || !element_ids.dependents) {
        console.error('enhanceElementSettings: Invalid element_ids configuration');
        return false;
    }
    
    var controllerElement = document.getElementById(element_ids.controller);
    
    if (!controllerElement) {
        console.warn('enhanceElementSettings: Controller element not found:', element_ids.controller);
        return false;
    }
    
    // Determine element type (checkbox, select, radio, etc.)
    var elementType = controllerElement.type;
    var isCheckbox = elementType === 'checkbox';
    var isSelect = controllerElement.tagName.toLowerCase() === 'select';
    
    /**
     * Update dependent fields visibility based on controller value
     */
    function updateDependentFields() {
        var shouldShow = false;
        
        if (isCheckbox) {
            // For checkboxes, show when checked (or use showWhen if specified)
            shouldShow = element_ids.showWhen !== undefined 
                ? controllerElement.checked === element_ids.showWhen 
                : controllerElement.checked;
        } else if (isSelect) {
            // For selects, show when value matches showWhen
            shouldShow = element_ids.showWhen !== undefined 
                ? controllerElement.value === element_ids.showWhen 
                : controllerElement.value !== '';
        } else {
            // For other inputs, show when value matches showWhen or has value
            shouldShow = element_ids.showWhen !== undefined 
                ? controllerElement.value === element_ids.showWhen 
                : controllerElement.value !== '';
        }
        
        // Update each dependent field
        element_ids.dependents.forEach(function(dependentId) {
            var dependentElement = document.getElementById(dependentId);
            if (dependentElement) {
                var parentRow = dependentElement.closest('tr');
                if (parentRow) {
                    if (shouldShow) {
                        parentRow.style.display = '';
                        parentRow.classList.remove('hidden-by-condition');
                    } else {
                        parentRow.style.display = 'none';
                        parentRow.classList.add('hidden-by-condition');
                    }
                }
            }
        });
    }
    
    // Add event listener based on element type
    if (isCheckbox) {
        controllerElement.addEventListener('change', updateDependentFields);
    } else if (isSelect) {
        controllerElement.addEventListener('change', updateDependentFields);
    } else {
        controllerElement.addEventListener('input', updateDependentFields);
        controllerElement.addEventListener('change', updateDependentFields);
    }
    
    // Initialize on page load
    updateDependentFields();
    
    return true;
}

/**
 * Synchronize range slider with number input
 * Updates both inputs when either one changes
 */
function syncRangeInputs(rangeId) {
    var rangeInput = document.getElementById(rangeId + '_range');
    var numberInput = document.getElementById(rangeId);
    
    if (rangeInput && numberInput) {
        // Sync range to number
        rangeInput.addEventListener('input', function() {
            numberInput.value = this.value;
        });
        
        // Sync number to range
        numberInput.addEventListener('input', function() {
            rangeInput.value = this.value;
        });
    }
}

/**
 * Enhanced color picker interactions
 * Note: Preview is now rendered inline via PHP, this function adds extra polish
 */
function enhanceColorPickers() {
    var colorContainers = document.querySelectorAll('.color-picker-container');
    colorContainers.forEach(function(container) {
        var colorInput = container.querySelector('.color-picker-input');
        var previewBox = container.querySelector('.color-preview-inline');
        
        // Add hover effect to color picker
        if (colorInput && previewBox) {
            colorInput.addEventListener('mouseenter', function() {
                previewBox.style.transform = 'scale(1.05)';
                previewBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            });
            
            colorInput.addEventListener('mouseleave', function() {
                previewBox.style.transform = 'scale(1)';
                previewBox.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            });
        }
    });
}

/**
 * Add character counter to textarea fields
 */
function addTextareaCounters() {
    var textareas = document.querySelectorAll('textarea');
    textareas.forEach(function(textarea) {
        var counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = 'font-size:12px; color:#646970; margin-top:5px;';
        
        function updateCounter() {
            var length = textarea.value.length;
            counter.textContent = length + ' characters';
        }
        
        updateCounter();
        textarea.parentNode.appendChild(counter);
        textarea.addEventListener('input', updateCounter);
    });
}

/**
 * Bandsintown Settings - Dynamic Field Interactions
 * Handles conditional field visibility based on user selections
 */
jQuery(document).ready(function($) {
    // Panel switching
    $(".panel-nav-item").on("click", function(e) {
        e.preventDefault();
        
        // Remove active class from all nav items and panels
        $(".panel-nav-item").removeClass("active");
        $(".panel-content-section").removeClass("active");
        
        // Add active class to clicked nav item
        $(this).addClass("active");
        
        // Show corresponding panel
        var panelId = $(this).data("panel");
        $("#panel-" + panelId).addClass("active");
    });
    
    // Section collapse/expand functionality
    $(".section-header.collapsible").on("click", function() {
        var sectionId = $(this).data("section-id");
        var $fields = $(".section-field[data-section-id=\'" + sectionId + "\']");
        var $spacer = $(".section-spacer[data-section-id=\'" + sectionId + "\']");
        var $icon = $(this).find(".section-toggle-icon");
        
        // Toggle visibility
        $fields.slideToggle(200);
        $spacer.slideToggle(200);
        
        // Toggle icon
        if ($icon.hasClass("dashicons-arrow-down-alt2")) {
            $icon.removeClass("dashicons-arrow-down-alt2").addClass("dashicons-arrow-right-alt2");
            $(this).addClass("collapsed");
        } else {
            $icon.removeClass("dashicons-arrow-right-alt2").addClass("dashicons-arrow-down-alt2");
            $(this).removeClass("collapsed");
        }
    });
    
    // Optional: Add hover effect for section headers
    $(".section-header.collapsible").hover(
        function() {
            $(this).css("cursor", "pointer");
        },
        function() {
            $(this).css("cursor", "default");
        }
    );

    $("#event-rsvp-only-show-icon").on("change", function() {
        enhanceElementSettings({
            controller: 'event-rsvp-only-show-icon',
            dependents: ['event-rsvp-text'],
            showWhen: 'false' // Show button label when format is "Button" (false)
        });
        console.log('Triggered change for event-rsvp-only-show-icon', $(this).val());
    });
    $("#event-rsvp-only-show-icon").trigger("change");

    $("#play-my-city-only-show-icon").on("change", function() {
        enhanceElementSettings({
            controller: 'play-my-city-only-show-icon',
            dependents: ['play-my-city-cta-text'],
            showWhen: 'false' // Show button label when format is "Button" (false)
        });
    });
    $("#play-my-city-only-show-icon").trigger("change");

    $("#header-show-follow-button").on("change", function() {
        enhanceElementSettings({
            controller: 'header-show-follow-button',
            dependents: ['follow-section-cta-text', 'follow-section-header-text'],
            showWhen: 'false' // Show button label when format is "Button" (false)
        });
    });
    $("#header-show-follow-button").trigger("change");

    console.log('Bandsintown Settings - JavaScript initialized successfully');
});
