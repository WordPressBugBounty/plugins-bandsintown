(function () {
    "use strict";
    var el = wp.element.createElement;
    var Fragment = wp.element.Fragment;
    var useRef = wp.element.useRef;
    var registerBlockType = wp.blocks.registerBlockType;
    var __ = wp.i18n.__;
    var InspectorControls = wp.blockEditor.InspectorControls;
    var useBlockProps = wp.blockEditor.useBlockProps;
    var PanelBody = wp.components.PanelBody;
    var TextControl = wp.components.TextControl;
    var TextareaControl = wp.components.TextareaControl;
    var ToggleControl = wp.components.ToggleControl;
    var ColorPicker = wp.components.ColorPicker;
    var RangeControl = wp.components.RangeControl;
    var SelectControl = wp.components.SelectControl;
    var PlainText = wp.blockEditor.PlainText;
    var defaultStyleSettings = {
        fontFamily: "Poppins, sans-serif",
        fontSize: "12px",
        textColor: "#666666",
        backgroundColor: "#ffffff",
        borderColor: "#dee2e6",
        borderRadius: "4px",
        button: {
            backgroundColor: "#007cba",
            hoverColor: "#28a745",
            color: "#ffffff",
        },
    };
    var shortcodeAttributes = bandsintownBlock.requiredShortcodePostMeta || {};
    var enforcedAttributes = bandsintownBlock.enforcedAttributes || {};

    var panelStyle = {
        fontFamily: defaultStyleSettings.fontFamily,
        fontSize: defaultStyleSettings.fontSize,
        textColor: defaultStyleSettings.textColor,
        backgroundColor: defaultStyleSettings.backgroundColor,
        borderColor: defaultStyleSettings.borderColor,
        borderRadius: defaultStyleSettings.borderRadius,
        navItem: {
            padding: "8px 12px",
            backgroundColor: defaultStyleSettings.borderColor,
            color: "gray",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            transition: "all 0.2s ease",
            border: "1px solid transparent",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10px",
        },
        navItemActive: {
            padding: "8px 12px",
            color: "#ffffff",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            transition: "all 0.2s ease",
            border: "1px solid transparent",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10px",
        },
        divContainer: {
            marginBottom: "10px",
            padding: "6px 8px",
            border: "1px solid " + defaultStyleSettings.borderColor,
            backgroundColor: defaultStyleSettings.backgroundColor,
            borderRadius: defaultStyleSettings.borderRadius,
            color: defaultStyleSettings.textColor,
        },
        p: {
            margin: "0 0 8px 0",
            fontWeight: "600",
            fontFamily: defaultStyleSettings.fontFamily,
            fontSize: defaultStyleSettings.fontSize,
            color: defaultStyleSettings.textColor,
        },
        label: {
            display: "block",
            fontSize: defaultStyleSettings.fontSize,
            color: defaultStyleSettings.textColor,
            fontFamily: defaultStyleSettings.fontFamily,
            fontWeight: "600",
            marginBottom: "3px",
        },
        labelFlex: {
            display: "flex",
            alignItems: "center",
            fontSize: defaultStyleSettings.fontSize,
            fontWeight: "600",
            color: defaultStyleSettings.textColor,
            cursor: "pointer",
        },
        plainText: {
            marginBottom: "8px",
            backgroundColor: defaultStyleSettings.backgroundColor,
            color: defaultStyleSettings.textColor,
            padding: "6px 8px",
            width: "90%",
            border: "1px solid #ced4da",
            borderRadius: defaultStyleSettings.borderRadius,
            fontSize: defaultStyleSettings.fontSize,
            fontFamily: defaultStyleSettings.fontFamily,
        },
        checkbox: {
            marginRight: "6px",
            transform: "scale(0.8)",
            color: defaultStyleSettings.textColor,
        },
        select: {
            width: "95%",
            padding: "2px",
            fontSize: defaultStyleSettings.fontSize,
            color: defaultStyleSettings.textColor,
        },
        titleHeader: {
            margin: "0",
            fontSize: "16px",
            fontWeight: "600",
            color: defaultStyleSettings.textColor,
            borderBottom: "1px solid " + defaultStyleSettings.borderColor,
        },
        title: {
            margin: "0",
            fontSize: "14px",
            fontWeight: "600",
            color: defaultStyleSettings.textColor,
            backgroundColor: defaultStyleSettings.backgroundColor,
            fontFamily: defaultStyleSettings.fontFamily,
        },
        button: {
            fontFamily: defaultStyleSettings.fontFamily,
            fontSize: defaultStyleSettings.fontSize,
            backgroundColor: defaultStyleSettings.button.backgroundColor,
            color: defaultStyleSettings.button.color,
            hoverColor: defaultStyleSettings.button.hoverColor,
            borderRadius: defaultStyleSettings.borderRadius,
            padding: "4px 8px",
        },
        buttonFlex: {
            fontFamily: defaultStyleSettings.fontFamily,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 12px",
            borderRadius: "4px",
            backgroundColor: defaultStyleSettings.button.backgroundColor,
            color: defaultStyleSettings.button.color,
            cursor: "pointer",
            transition: "background-color 0.2s ease",
            "&:hover": {
                backgroundColor: defaultStyleSettings.button.hoverColor,
            },
        },
        dropdown: {
            fontFamily: defaultStyleSettings.fontFamily,
            backgroundColor: defaultStyleSettings.backgroundColor,
            borderColor: defaultStyleSettings.borderColor,
            iconSize: "12px",
        },
        dropdownOpen: {
            backgroundColor: defaultStyleSettings.backgroundColor,
            border: "1px solid " + defaultStyleSettings.borderColor,
            borderTop: "none",
            borderRadius: "0 0 " + defaultStyleSettings.borderRadius + " " + defaultStyleSettings.borderRadius,
            padding: "10px",
            fontSize: defaultStyleSettings.fontSize,
        },
        preview: {
            headerFontSize: "16px",
            titleFontSize: "18px",
            iconSize: "48px",
            backgroundColor: defaultStyleSettings.backgroundColor,
            borderColor: defaultStyleSettings.borderColor,
            fontFamily: defaultStyleSettings.fontFamily,
        },
        states: {
            hover: "#e9ecef",
            success: "#28a745",
            muted: "#6c757d",
        },
    };

    // Option 1: SVG Music Note Icon
    const musicNoteIcon = el(
        "svg",
        {
            width: 24,
            height: 24,
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg",
        },
        el("path", {
            d: "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
            fill: "currentColor",
        }),
    );

    // Option 2: SVG Ticket Icon (Alternative)
    const ticketIcon = el(
        "svg",
        {
            width: 24,
            height: 24,
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg",
        },
        el("path", {
            d: "M20 6h-3.17L15 4.17V2H9v2.17L7.17 6H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z",
            fill: "currentColor",
        }),
    );

    // Option 3: Use PNG icon if available (via localized data)
    const bandsintownIcon =
        typeof bandsintownBlock !== "undefined" && bandsintownBlock.iconUrl
            ? el("img", {
                  src: bandsintownBlock.iconUrl,
                  alt: "Bandsintown",
                  style: { width: "20px", height: "20px" },
              })
            : musicNoteIcon; // Fallback to SVG

    // Function to generate block attributes from defaultPanelAttributes
    function generateBlockAttributes() {
        var blockAttributes = {};

        // Check if defaultPanelAttributes exists
        if (typeof bandsintownBlock !== "undefined" && bandsintownBlock.defaultPanelAttributes) {
            var panelData = bandsintownBlock.defaultPanelAttributes;
            // Process each category in defaultPanelAttributes
            Object.keys(panelData).forEach(function (categoryKey) {
                var category = panelData[categoryKey];

                if (category.elements) {
                    Object.keys(category.elements).forEach(function (elementKey) {
                        var element = category.elements[elementKey];

                        // Generate WordPress block attribute from element data
                        var attributeConfig = {
                            type: getWPAttributeType(element.type),
                            default: element.default || getDefaultByType(element.type),
                        };

                        // Use element key as attribute name (convert to camelCase)
                        var attributeName = elementKey.replace(/-([a-z])/g, function (g) {
                            return g[1].toUpperCase();
                        });

                        blockAttributes[attributeName] = attributeConfig;
                    });
                }
            });
        }

        // Add some additional WordPress-specific attributes
        blockAttributes.appId = { type: "string", default: "", id: "app-id" };
        return blockAttributes;
    }

    // Helper function to convert element type to WordPress attribute type
    function getWPAttributeType(elementType) {
        switch (elementType) {
            case "number":
            case "range":
                return "number";
            case "checkbox":
            case "toggle":
                return "boolean";
            case "color":
            case "text":
            case "textarea":
            case "select":
            default:
                return "string";
        }
    }

    // Helper function to get default value by type
    function getDefaultByType(elementType) {
        switch (elementType) {
            case "number":
            case "range":
                return 0;
            case "checkbox":
            case "toggle":
                return false;
            case "color":
                return "#000000";
            case "text":
            case "textarea":
            case "select":
            default:
                return "";
        }
    }

    function setShortcode($key, $value) {
        shortcodeAttributes[$key] = $value;
        return true;
    }

    function generateShortcode() {
        var shortcode = "[bandsintown_widget ";
        jQuery.each(enforcedAttributes, function (key, value) {
            shortcodeAttributes[key] = value;
        });
        jQuery.each(shortcodeAttributes, function (key, value) {
            shortcode += " " + key + '="' + value + '"';
        });
        shortcode += "]";

        return shortcode;
    }

    // Get the plugin URL from localized data or construct it
    registerBlockType("bandsintown/events-block", {
        apiVersion: 3,
        title: __("Bandsintown Events", "bandsintown"),
        description: __("Display tour dates, sell tickets, get RSVPs and more, by connecting Bandsintown to your site.", "bandsintown"),
        category: "widgets",
        icon: bandsintownIcon,
        keywords: [__("events", "bandsintown"), __("concerts", "bandsintown"), __("bandsintown", "bandsintown"), __("tours", "bandsintown"), __("music", "bandsintown")],
        supports: {
            html: false,
            align: ["wide", "full"],
            customClassName: false,
            spacing: false,
        },
        attributes: generateBlockAttributes(),

        edit: function (props) {
            var attributes = props.attributes;
            var setAttributes = props.setAttributes;
            var isSelected = props.isSelected;
            const [error, setError] = wp.element.useState("");
            // Auto-embed shortcode when block is first added
            wp.element.useEffect(
                function () {
                    // Check if this is a newly added block (no artist set and block is selected)
                    if (isSelected && !attributes.artistName && typeof bandsintownBlock !== "undefined" && bandsintownBlock.defaultSettings && bandsintownBlock.defaultSettings.artist) {
                        // Set default artist from plugin settings
                        setAttributes({
                            artistName: bandsintownBlock.defaultSettings.artist,
                        });

                        // Generate and display initial shortcode
                        setShortcode("artist-name", bandsintownBlock.defaultSettings.artist);

                        // Show a brief notification that shortcode is ready
                        setTimeout(function () {
                            if (typeof wp.data !== "undefined" && wp.data.dispatch) {
                                wp.data.dispatch("core/notices").createNotice("info", "Bandsintown widget added! Shortcode is ready to copy.", {
                                    isDismissible: true,
                                    type: "snackbar",
                                });
                            }
                        }, 500);
                    }
                },
                [isSelected],
            );

            // Function to generate control element based on element configuration
            function generateControl(elementKey, element, value) {
                var attributeName = elementKey.replace(/-([a-z])/g, function (g) {
                    return g[1].toUpperCase();
                });
                if (element.showBy && attributes[element.showBy.control] != null && attributes[element.showBy.control] != element.showBy.value) {
                    if (element.showBy.falseValue !== undefined) {
                        var updateObj = {},
                            falseValue = element.showBy.falseValue + (element.unit || "");
                        updateObj[attributeName] = falseValue;
                        setAttributes(updateObj);
                        setShortcode(element.id, falseValue);
                    }
                    return null;
                }
                switch (element.type) {
                    case "text":
                        // Date format validation
                        function isValidDateFormat(val) {
                            // Example: allow only letters, dots, commas, spaces, YMD, and slashes
                            return /^[A-Za-z.,\sYMD/-]+$/.test(val);
                        }
                        return el(
                            "div",
                            {
                                style: {
                                    marginBottom: "15px",
                                },
                                className: "nttext-control-wrapper",
                            },
                            el(TextControl, {
                                label: __(element.label, "bandsintown"),
                                defaultValue: value || element.default || "",
                                onChange: function (newValue) {
                                    if (element.id === "date-format") {
                                        if (!isValidDateFormat(newValue)) {
                                            setError("Invalid date format string.");
                                            //return;
                                        } else {
                                            setError("");
                                        }
                                    }
                                    var updateObj = {};
                                    updateObj[attributeName] = newValue;
                                    jQuery.each(element.dependencies || [], function (__, depKey) {
                                        updateObj[depKey] = newValue;
                                        setShortcode(depKey, updateObj[depKey]);
                                    });
                                    setAttributes(updateObj);
                                    setShortcode(element.id, newValue);
                                },
                                help: error || (element.description ? element.description : undefined),
                                placeholder: element.placeholder || element.default,
                                className: element.help ? "none-margin" : "",
                            }),
                            element.help &&
                                el(
                                    "a",
                                    {
                                        href: element.help.href,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        style: { color: "#2271b1", textDecoration: "underline", marginTop: "0", marginBottom: "8px", display: "inline-block" },
                                    },
                                    element.help.text || "Bandsintown Website",
                                ),
                        );

                    case "number":
                        // Special handling for display-limit: accept number or "All" text
                        if (element.id === "display-limit") {
                            var isShowAll = value === 0 || value === "0";
                            var displayValue = isShowAll ? "All" : value !== undefined && value !== null && value !== "" && value !== 0 ? value : element.default || "15";

                            return el(
                                "div",
                                {
                                    style: {
                                        marginBottom: "15px",
                                    },
                                },
                                // Label
                                el(
                                    "label",
                                    {
                                        style: {
                                            display: "block",
                                            marginBottom: "6px",
                                            fontSize: "11px",
                                            fontWeight: "500",
                                            textTransform: "uppercase",
                                            color: "#1e1e1e",
                                        },
                                    },
                                    __(element.label, "bandsintown"),
                                ),

                                // Text input that accepts number or "All"
                                el("input", {
                                    type: "text",
                                    defaultValue: displayValue,
                                    key: "display-limit-" + displayValue,
                                    placeholder: 'Enter number or type "All"',
                                    onBlur: function (e) {
                                        // On blur, validate and save the input
                                        var inputValue = e.target.value.trim();
                                        var updateObj = {};

                                        if (inputValue.toLowerCase() === "all") {
                                            // User typed "All"
                                            updateObj[attributeName] = 0;
                                            setShortcode(element.id, "0");
                                            setAttributes(updateObj);
                                        } else {
                                            var numValue = parseInt(inputValue);
                                            if (!isNaN(numValue) && numValue > 0) {
                                                // Valid number - clamp to min/max
                                                numValue = Math.max(element.min || 1, Math.min(element.max || 50, numValue));
                                                updateObj[attributeName] = numValue;
                                                setShortcode(element.id, numValue + "");
                                                setAttributes(updateObj);
                                            } else if (inputValue === "") {
                                                // Empty - reset to default
                                                updateObj[attributeName] = parseInt(element.default) || 15;
                                                setShortcode(element.id, (parseInt(element.default) || 15) + "");
                                                setAttributes(updateObj);
                                                e.target.value = (parseInt(element.default) || 15) + "";
                                            } else {
                                                // Invalid input - reset to current value or default
                                                var currentValue = value !== undefined && value !== null && value !== "" && value !== 0 ? value : parseInt(element.default) || 15;
                                                e.target.value = currentValue === 0 ? "All" : currentValue;
                                            }
                                        }
                                    },
                                    onKeyDown: function (e) {
                                        // Allow Enter key to trigger blur/save
                                        if (e.key === "Enter") {
                                            e.target.blur();
                                        }
                                    },
                                    style: {
                                        width: "100%",
                                        fontSize: "13px",
                                        border: "1px solid #949494",
                                        borderRadius: "2px",
                                        backgroundColor: "#ffffff",
                                        color: "#1e1e1e",
                                    },
                                }),

                                // Help text
                                element.description &&
                                    el(
                                        "p",
                                        {
                                            style: {
                                                margin: "6px 0 0 0",
                                                fontSize: "12px",
                                                fontStyle: "normal",
                                                color: "#757575",
                                            },
                                        },
                                        __(element.description, "bandsintown"),
                                    ),
                            );
                        }

                        // Default number handling with range slider
                        return el(
                            "div",
                            {
                                style: {
                                    marginBottom: "15px",
                                },
                            },
                            // Label
                            el(
                                "label",
                                {
                                    style: {
                                        display: "block",
                                        marginBottom: "6px",
                                        fontSize: "11px",
                                        fontWeight: "500",
                                        textTransform: "uppercase",
                                        color: "#1e1e1e",
                                    },
                                },
                                __(element.label, "bandsintown"),
                            ),

                            // Range control container with inline unit
                            el(
                                "div",
                                {
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                    },
                                },
                                // Range control
                                el(
                                    "div",
                                    {
                                        style: {
                                            flex: "1",
                                        },
                                    },
                                    el(RangeControl, {
                                        value: value !== undefined && value !== null && value !== "" ? parseInt(value) : parseInt(element.default) || element.min || 0,
                                        onChange: function (newValue) {
                                            var updateObj = {};
                                            updateObj[attributeName] = parseInt(newValue);
                                            jQuery.each(element.dependencies || [], function (__, depKey) {
                                                updateObj[depKey] = updateObj[attributeName];
                                                setShortcode(depKey, updateObj[depKey] + (element.unit || ""));
                                            });
                                            setAttributes(updateObj);
                                            setShortcode(element.id, updateObj[attributeName] + (element.unit || ""));
                                        },
                                        min: element.min || 0,
                                        max: element.max || 100,
                                        step: element.step || 1,
                                        withInputField: false, // Hide the default input field
                                    }),
                                ),

                                // Custom number input with unit
                                el(
                                    "div",
                                    {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            border: "1px solid #949494",
                                            borderRadius: "2px",
                                            minWidth: element.unit ? "80px" : "auto",
                                        },
                                    },
                                    el("input", {
                                        type: "number",
                                        value: value !== undefined && value !== null && value !== "" ? parseInt(value) : parseInt(element.default) || element.min || 0,
                                        min: element.min || 0,
                                        max: element.max || 100,
                                        step: element.step || 1,
                                        onChange: function (e) {
                                            var newValue = e.target.value !== "" ? parseInt(e.target.value) : 0;
                                            var updateObj = {};
                                            updateObj[attributeName] = newValue;
                                            jQuery.each(element.dependencies || [], function (__, depKey) {
                                                updateObj[depKey] = newValue;
                                                setShortcode(depKey, updateObj[depKey] + (element.unit || ""));
                                            });
                                            setAttributes(updateObj);
                                            setShortcode(element.id, newValue + (element.unit || ""));
                                        },
                                        style: {
                                            border: "none",
                                            outline: "none",
                                            padding: "4px 6px",
                                            fontSize: "13px",
                                            width: element.max <= 100 ? "50px" : "55px",
                                            textAlign: "right",
                                        },
                                    }),

                                    // Unit display
                                    element.unit &&
                                        el(
                                            "span",
                                            {
                                                style: {
                                                    padding: "4px 6px",
                                                    fontSize: "12px",
                                                    color: "#757575",
                                                    backgroundColor: "#f0f0f0",
                                                    borderLeft: "1px solid #ddd",
                                                    minWidth: "24px",
                                                    textAlign: "center",
                                                },
                                            },
                                            element.unit,
                                        ),
                                ),
                            ),

                            // Help text
                            element.description &&
                                el(
                                    "p",
                                    {
                                        style: {
                                            margin: "6px 0 0 0",
                                            fontSize: "12px",
                                            fontStyle: "normal",
                                            color: "#757575",
                                        },
                                    },
                                    __(element.description, "bandsintown"),
                                ),
                        );
                    case "checkbox":
                    case "toggle":
                        return el(ToggleControl, {
                            label: __(element.label, "bandsintown"),
                            checked: value !== undefined ? Boolean(value) : Boolean(element.default),
                            onChange: function (newValue) {
                                var updateObj = {};
                                updateObj[attributeName] = Boolean(newValue);
                                jQuery.each(element.dependencies || [], function (__, depKey) {
                                    updateObj[depKey] = newValue;
                                    setShortcode(depKey, newValue ? "true" : "false");
                                });
                                switch (attributeName) {
                                    case "showDividers":
                                        updateObj["separatorColor"] = !newValue ? "rgba(0,0,0,0)" : "rgba(221,221,221,1)";
                                        setShortcode("separator-color", updateObj["separatorColor"]);
                                        break;
                                    case "headerShowFollowButton":
                                        updateObj["followSectionPosition"] = newValue ? "top" : "hidden";
                                        setShortcode("follow-section-position", updateObj["followSectionPosition"]);
                                        break;
                                    case "showMyCity":
                                        updateObj["playMyCityPosition"] = newValue ? "bottom" : "hidden";
                                        setShortcode("play-my-city-position", updateObj["playMyCityPosition"]);
                                        break;
                                    default:
                                        break;
                                }
                                setShortcode(element.id, newValue ? "true" : "false");
                                setAttributes(updateObj);
                            },
                            // help: element.description ? __(element.description, 'bandsintown') : undefined
                        });

                    case "color":
                        return el(
                            Fragment,
                            {},
                            el(
                                "p",
                                {
                                    style: {
                                        marginBottom: "8px",
                                        fontSize: "11px",
                                        fontWeight: "500",
                                        textTransform: "uppercase",
                                    },
                                },
                                __(element.label, "bandsintown"),
                            ),
                            el(
                                "div",
                                {
                                    style: {
                                        marginBottom: "0",
                                    },
                                    className: "bandsintown-color-picker-wrapper",
                                },
                                el(
                                    "style",
                                    {},
                                    `
                                    .bandsintown-color-picker-wrapper .components-color-picker .components-input-control__container {
                                        display: none !important;
                                    }
                                `,
                                ),
                                el(ColorPicker, {
                                    color: value || element.default || "#000000",
                                    enableAlpha: true,
                                    onChange: function (newValue) {
                                        var colorValue;

                                        // ColorPicker returns either a string or an object {r, g, b, a}
                                        if (typeof newValue === "string") {
                                            colorValue = newValue;
                                        } else if (newValue && typeof newValue === "object") {
                                            // Convert RGBA object to string: rgba(r, g, b, a)
                                            var r = Math.round(newValue.rgb?.r || newValue.r || 0);
                                            var g = Math.round(newValue.rgb?.g || newValue.g || 0);
                                            var b = Math.round(newValue.rgb?.b || newValue.b || 0);
                                            var a = newValue.rgb?.a !== undefined ? newValue.rgb.a : newValue.a !== undefined ? newValue.a : 1;
                                            colorValue = "rgba(" + r + "," + g + "," + b + "," + a + ")";
                                        } else {
                                            colorValue = element.default || "#000000";
                                        }

                                        var updateObj = {};
                                        updateObj[attributeName] = colorValue;
                                        jQuery.each(element.dependencies || [], function (__, depKey) {
                                            updateObj[depKey] = colorValue;
                                            setShortcode(depKey, updateObj[depKey] + (element.unit || ""));
                                        });
                                        setAttributes(updateObj);
                                        setShortcode(element.id, colorValue + (element.unit || ""));
                                    },
                                }),
                            ),
                            el(TextControl, {
                                label: __("Color Value", "bandsintown"),
                                value: value || element.default || "#000000",
                                onChange: function (newValue) {
                                    var updateObj = {};
                                    updateObj[attributeName] = newValue;
                                    jQuery.each(element.dependencies || [], function (__, depKey) {
                                        updateObj[depKey] = newValue;
                                        setShortcode(depKey, updateObj[depKey] + (element.unit || ""));
                                    });
                                    setAttributes(updateObj);
                                    setShortcode(element.id, newValue + (element.unit || ""));
                                },
                                help: __("Enter color as hex (#000000) or rgba (rgba(0,0,0,1))", "bandsintown"),
                                placeholder: "rgba(255,255,255,1) or #FFFFFF",
                            }),
                        );

                    case "select":
                        return el(SelectControl, {
                            label: __(element.label, "bandsintown"),
                            value: value || element.default || "",
                            onChange: function (newValue) {
                                var updateObj = {};
                                updateObj[attributeName] = newValue;
                                jQuery.each(element.dependencies || [], function (__, depKey) {
                                    updateObj[depKey] = newValue;
                                    setShortcode(depKey, updateObj[depKey] + (element.unit || ""));
                                });
                                if (attributeName == "dateFormatSuggestions") {
                                    if (newValue !== "custom") {
                                        updateObj["dateFormat"] = newValue;
                                        setAttributes(updateObj);
                                        setShortcode("date-format", newValue);
                                    } else {
                                        updateObj["dateFormat"] = "MMM. D, YYYY";
                                        setShortcode("date-format", "MMM. D, YYYY");
                                    }
                                }
                                setAttributes(updateObj);
                                setShortcode(element.id, newValue + (element.unit || ""));
                            },
                            options: element.options || [],
                            // help: element.description ? __(element.description, 'bandsintown') : undefined
                        });

                    case "textarea":
                        return el(TextareaControl, {
                            label: __(element.label, "bandsintown"),
                            value: value || element.default || "",
                            onChange: function (newValue) {
                                var updateObj = {};
                                updateObj[attributeName] = newValue;
                                jQuery.each(element.dependencies || [], function (__, depKey) {
                                    updateObj[depKey] = newValue;
                                    setShortcode(depKey, updateObj[depKey] + (element.unit || ""));
                                });
                                setAttributes(updateObj);
                                setShortcode(element.id, newValue + (element.unit || ""));
                            },
                            // help: element.description ? __(element.description, 'bandsintown') : undefined,
                            placeholder: element.placeholder || element.default,
                            rows: element.rows || 3,
                            cols: element.cols || 40,
                        });

                    case "button":
                        return el(
                            "div",
                            {
                                style: {
                                    marginTop: "15px",
                                },
                            },
                            el(
                                "button",
                                {
                                    className: "components-button is-primary",
                                    onClick: function (e) {
                                        var buttonId = element.id;
                                        if (buttonId === "connect-account") {
                                            var panelBody = jQuery(e.target).closest(".components-panel__body");
                                            if (panelBody.hasClass("is-opened")) {
                                                panelBody.find(".components-panel__body-toggle").trigger("click");
                                                setTimeout(function () {
                                                    var generalPanel = jQuery(".components-panel__body").filter(function () {
                                                        return jQuery(this).find(".components-panel__body-title button").text().trim() === "Generals";
                                                    });
                                                    if (generalPanel.length && !generalPanel.hasClass("is-opened")) {
                                                        generalPanel.find(".components-panel__body-toggle").trigger("click");
                                                        setTimeout(function () {
                                                            var input = generalPanel.find("input.components-text-control__input").first();
                                                            if (input.length) {
                                                                input.focus();
                                                                input.select();
                                                                input[0].setSelectionRange(0, input[0].value.length);
                                                            }
                                                        }, 150);
                                                    }
                                                }, 100);
                                            }
                                        }
                                    },
                                    style: {
                                        width: "100%",
                                        justifyContent: "center",
                                        padding: "8px 16px",
                                        fontSize: "13px",
                                        fontWeight: "500",
                                        borderRadius: "4px",
                                    },
                                },
                                __(element.label, "bandsintown"),
                            ),
                            element.description &&
                                el(
                                    "p",
                                    {
                                        style: {
                                            margin: "6px 0 0 0",
                                            fontSize: "12px",
                                            fontStyle: "italic",
                                            color: "#757575",
                                        },
                                    },
                                    __(element.description, "bandsintown"),
                                ),
                        );

                    case "link":
                        return el(
                            "div",
                            {
                                style: {
                                    marginTop: "5px",
                                },
                            },
                            el(
                                "a",
                                {
                                    href: element.href || "#",
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: " is-link",
                                    style: {
                                        display: "block",
                                        width: "100%",
                                        textAlign: "center",
                                        padding: "8px 16px",
                                        fontSize: "13px",
                                        fontWeight: "500",
                                        textDecoration: "none",
                                        color: "#2271b1",
                                        transition: "all 0.2s ease",
                                        border: "none",
                                        outline: "none",
                                        boxShadow: "none",
                                    },
                                    onMouseEnter: function (e) {
                                        e.target.style.border = "none";
                                    },
                                    onMouseLeave: function (e) {
                                        e.target.style.border = "none";
                                    },
                                    onFocus: function (e) {
                                        e.target.style.border = "none";
                                        e.target.style.outline = "none";
                                        e.target.style.boxShadow = "none";
                                    },
                                },
                                __(element.label, "bandsintown"),
                            ),
                            element.description &&
                                el(
                                    "p",
                                    {
                                        style: {
                                            margin: "6px 0 0 0",
                                            fontSize: "12px",
                                            fontStyle: "italic",
                                            color: "#757575",
                                        },
                                    },
                                    __(element.description, "bandsintown"),
                                ),
                        );

                    default:
                        return null;
                }
            }

            // Function to generate panel controls
            function generatePanelControls() {
                var panels = [];

                if (typeof bandsintownBlock !== "undefined" && bandsintownBlock.defaultPanelAttributes) {
                    var panelData = bandsintownBlock.defaultPanelAttributes;
                    Object.keys(panelData).forEach(function (categoryKey, index) {
                        var category = panelData[categoryKey];
                        var controls = [];

                        if (category.elements) {
                            Object.keys(category.elements).forEach(function (elementKey) {
                                var element = category.elements[elementKey];
                                var attributeName = elementKey.replace(/-([a-z])/g, function (g) {
                                    return g[1].toUpperCase();
                                });
                                var value = attributes[attributeName];

                                var control = generateControl(elementKey, element, value);

                                if (element.type === "checkbox" || element.type === "toggle") {
                                    value = value ? "true" : "false";
                                }
                                if (value != element.default && (control || attributeName == "dateFormat")) {
                                    setShortcode(element.id, value + (element.unit || ""));
                                    jQuery.each(element.dependencies || [], function (__, depKey) {
                                        setShortcode(depKey, value + (element.unit || ""));
                                    });
                                }

                                if (control) {
                                    controls.push(control);
                                }
                            });
                        }

                        if (controls.length > 0) {
                            panels.push(
                                el(
                                    PanelBody,
                                    {
                                        title: __(category.label || categoryKey, "bandsintown"),
                                        initialOpen: index === 0, // Open first panel by default
                                    },
                                    ...controls,
                                ),
                            );
                        }
                    });
                }

                return panels;
            }

            // Get basic values for preview (fallback to old structure if needed)
            var artist = attributes.artistName || attributes.artist || "";
            var appId = attributes.appId || "";
            var widgetWidthDefault = 920,
                widgetWidth = attributes.widgetWidth || widgetWidthDefault;
            var backgroundColor = attributes.backgroundColor || "#ffffff";
            var textColor = attributes.textColor || "#000000";

            // State for shortcode display
            var shortcodeRef = wp.element.useRef();
            var copyButtonRef = wp.element.useRef();

            // Function to copy shortcode to clipboard
            function copyShortcodeToClipboard(shortcodeText) {
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard
                        .writeText(shortcodeText)
                        .then(function () {
                            showCopySuccess();

                            // Also show WordPress admin notice if available
                            if (typeof wp.data !== "undefined" && wp.data.dispatch) {
                                wp.data.dispatch("core/notices").createNotice("success", "Shortcode copied to clipboard! You can now paste it anywhere on your site.", {
                                    isDismissible: true,
                                    type: "snackbar",
                                });
                            }
                        })
                        .catch(function (err) {
                            console.error("Failed to copy shortcode: ", err);
                            showCopyError();
                        });
                } else {
                    // Fallback for older browsers
                    var textArea = document.createElement("textarea");
                    textArea.value = shortcodeText;
                    textArea.style.position = "fixed";
                    textArea.style.opacity = "0";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    try {
                        var successful = document.execCommand("copy");
                        if (successful) {
                            showCopySuccess();
                        } else {
                            showCopyError();
                        }
                    } catch (err) {
                        console.error("Fallback copy failed: ", err);
                        showCopyError();
                    }
                    document.body.removeChild(textArea);
                }
            }

            // Helper functions for copy feedback
            function showCopySuccess() {
                if (copyButtonRef.current) {
                    var originalText = copyButtonRef.current.textContent;
                    copyButtonRef.current.textContent = "✓ Copied!";
                    copyButtonRef.current.style.backgroundColor = "#28a745";
                    copyButtonRef.current.style.transform = "scale(1.05)";
                    setTimeout(function () {
                        if (copyButtonRef.current) {
                            copyButtonRef.current.textContent = originalText;
                            copyButtonRef.current.style.backgroundColor = "#007cba";
                            copyButtonRef.current.style.transform = "scale(1)";
                        }
                    }, 2500);
                }
            }

            function showCopyError() {
                if (copyButtonRef.current) {
                    var originalText = copyButtonRef.current.textContent;
                    copyButtonRef.current.textContent = "✗ Failed";
                    copyButtonRef.current.style.backgroundColor = "#dc3545";
                    setTimeout(function () {
                        if (copyButtonRef.current) {
                            copyButtonRef.current.textContent = originalText;
                            copyButtonRef.current.style.backgroundColor = "#007cba";
                        }
                    }, 2500);
                }
            }
            var blockProps = useBlockProps({
                style: {
                    backgroundColor: backgroundColor,
                    color: textColor,
                    borderRadius: (attributes.borderRadius || 4) + "px",
                    minHeight: "150px",
                    minWidth: widgetWidth + 40 + "px",
                },
            });

            return el(
                Fragment,
                {},
                el(
                    InspectorControls,
                    {
                        style: {
                            "--wp-components-panel-body-border": "none",
                        },
                    },
                    ...generatePanelControls(),
                ),

                // Main Block Content
                el(
                    "div",
                    blockProps,
                    el(
                        "div",
                        {
                            className: "bandsintown-events-block__content",
                            style: {
                                minWidth: widgetWidth + 40 + "px",
                            },
                        },

                        // Live Widget Preview
                        artist && appId
                            ? el(
                                  "div",
                                  {
                                      style: {
                                          border: "2px dashed #dee2e6",
                                          borderRadius: "6px",
                                          backgroundColor: backgroundColor || "#ffffff",
                                          color: textColor || "#000000",
                                          minHeight: "200px",
                                          display: "flex",
                                          flexDirection: "column",
                                          justifyContent: "flex-start",
                                          margin: "auto",
                                      },
                                  },
                                  // Bandsintown Widget Container
                                  el("div", {
                                      style: {
                                          flex: 1,
                                          minHeight: "150px",
                                      },
                                      ref: function (node) {
                                          if (node && artist && artist.trim()) {
                                              // Clear previous content
                                              node.innerHTML = "";

                                              // Create Bandsintown widget script
                                              var script = document.createElement("script");
                                              script.type = "text/javascript";
                                              script.src = bandsintownBlock.widgetSrc;
                                              script.async = true;

                                              // Create widget anchor element with all attributes
                                              var widget = document.createElement("a");
                                              widget.className = "bit-widget-initializer";
                                              // Set widget attributes based on block settings
                                              jQuery.each(shortcodeAttributes, function (key, value) {
                                                  // Skip display-limit if value is 0 (meaning "All events")
                                                  // Bandsintown widget will show all events when this attribute is not set
                                                  if (key === "display-limit" && (value === 0 || value === "0")) {
                                                      return; // Skip this attribute
                                                  }
                                                  widget.setAttribute("data-" + key, value);
                                              });

                                              // Update shortcode display
                                              if (shortcodeRef.current) {
                                                  shortcodeRef.current.textContent = generateShortcode();
                                              }
                                              // Inject custom style
                                              var styleId = "bit-ipad-responsive-style";
                                              var style = document.createElement("style");
                                              style.id = styleId;
                                              style.innerHTML = `
                                                .bit-offers-two-ticket-container {
                                                    flex-direction: ${widgetWidth <= 864 ? "column" : "row"} !important;
                                                }
                                            `;
                                              node.appendChild(style);

                                              // Add inline script to check .bit-widget-container not empty and apply styles
                                              var inlineScript = document.createElement("script");
                                              inlineScript.type = "text/javascript";
                                              inlineScript.textContent =
                                                  "function applyResponsiveStyles() {" +
                                                  "    var widgetWidth = " +
                                                  widgetWidth +
                                                  ";" +
                                                  '    var ticketContainers = document.querySelectorAll(".bit-offers-two-ticket-container");' +
                                                  "    if (ticketContainers.length > 0) {" +
                                                  "        ticketContainers.forEach(function(container, index) {" +
                                                  '            var bitEvent = container.closest(".bit-event");' +
                                                  "            if (bitEvent) {" +
                                                  '                var detailsInnerWrapper = bitEvent.querySelector(".bit-details-inner-wrapper");' +
                                                  "                if (detailsInnerWrapper) {" +
                                                  "                    if (widgetWidth >= 865 && widgetWidth <= 955) {" +
                                                  '                        detailsInnerWrapper.style.setProperty("width", "40%", "important");' +
                                                  "                    } " +
                                                  "                }" +
                                                  "            }" +
                                                  "        });" +
                                                  "    }" +
                                                  "}" +
                                                  "" +
                                                  "function checkWidgetContainer() {" +
                                                  '    var widgetContainer = document.querySelector(".bit-widget-container");' +
                                                  "    if (widgetContainer && widgetContainer.children.length > 0) {" +
                                                  "        applyResponsiveStyles();" +
                                                  "        return true;" +
                                                  "    }" +
                                                  "    return false;" +
                                                  "}" +
                                                  "" +
                                                  "var checkInterval = setInterval(function() {" +
                                                  "    if (checkWidgetContainer()) {" +
                                                  "        clearInterval(checkInterval);" +
                                                  "    }" +
                                                  "}, 200);" +
                                                  "" +
                                                  "// Clear interval after 30 seconds to prevent infinite checking" +
                                                  "setTimeout(function() {" +
                                                  "    clearInterval(checkInterval);" +
                                                  "}, 30000);";
                                              node.appendChild(inlineScript);

                                              // Append elements to container
                                              node.appendChild(script);
                                              node.appendChild(widget);

                                              // Initialize widget after script loads
                                              script.onload = function () {
                                                  if (window.BIT && window.BIT.Widget) {
                                                      try {
                                                          window.BIT.Widget.initialize();
                                                      } catch (e) {
                                                          console.log("Bandsintown widget initialization:", e);
                                                      }
                                                  }
                                              };

                                              // Fallback initialization after delay
                                              setTimeout(function () {
                                                  if (window.BIT && window.BIT.Widget) {
                                                      try {
                                                          window.BIT.Widget.initialize();
                                                      } catch (e) {
                                                          console.log("Bandsintown widget fallback initialization:", e);
                                                      }
                                                  }
                                              }, 1000);
                                          } else if (node) {
                                              // Show placeholder when no artist
                                              node.innerHTML = '<div style="padding: 20px; text-align: center; color: #6c757d; font-size: 14px;">Enter an artist name to load live events</div>';
                                          }
                                      },
                                  }),
                              )
                            : el(
                                  "div",
                                  {
                                      style: {
                                          textAlign: "center",
                                          padding: "40px 20px",
                                          color: "#6c757d",
                                          fontSize: panelStyle.title.fontSize,
                                          border: "2px dashed #dee2e6",
                                          borderRadius: "6px",
                                      },
                                  },
                                  el(
                                      "div",
                                      {
                                          style: {
                                              fontSize: "48px",
                                              marginBottom: "15px",
                                              opacity: "0.3",
                                          },
                                      },
                                      "🎵",
                                  ),
                                  el(
                                      "p",
                                      {
                                          style: {
                                              margin: "0",
                                              fontSize: "16px",
                                              fontWeight: "500",
                                          },
                                      },
                                      __("Enter an artist name and an API Key to see preview", "bandsintown"),
                                  ),
                              ),

                        // Shortcode Display Section - Show when artist is set OR block is selected
                        (artist || isSelected) &&
                            el(
                                "div",
                                {
                                    style: {
                                        marginTop: "20px",
                                        padding: "15px",
                                        backgroundColor: isSelected ? "#e7f3ff" : "#f8f9fa",
                                        border: isSelected ? "2px solid #007cba" : "1px solid #dee2e6",
                                        borderRadius: "6px",
                                        transition: "all 0.3s ease",
                                        display: "none",
                                    },
                                    className: "shortcode-display-section",
                                },
                                el(
                                    "div",
                                    {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "10px",
                                        },
                                    },
                                    el(
                                        "h4",
                                        {
                                            style: {
                                                margin: "0",
                                                fontSize: "14px",
                                                fontWeight: "600",
                                                color: isSelected ? "#007cba" : "#495057",
                                            },
                                        },
                                        __("Generated Shortcode:", "bandsintown"),
                                    ),
                                    el(
                                        "button",
                                        {
                                            ref: copyButtonRef,
                                            style: {
                                                padding: "8px 16px",
                                                fontSize: "12px",
                                                backgroundColor: "#007cba",
                                                color: "#ffffff",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                fontWeight: "600",
                                                boxShadow: "0 2px 4px rgba(0,124,186,0.2)",
                                                transition: "all 0.2s ease",
                                            },
                                            onMouseOver: function (e) {
                                                e.target.style.backgroundColor = "#005a87";
                                                e.target.style.transform = "translateY(-1px)";
                                            },
                                            onMouseOut: function (e) {
                                                if (e.target.textContent !== "Copied!") {
                                                    e.target.style.backgroundColor = "#007cba";
                                                }
                                                e.target.style.transform = "translateY(0)";
                                            },
                                            onClick: function () {
                                                if (shortcodeRef.current) {
                                                    copyShortcodeToClipboard(shortcodeRef.current.textContent);
                                                }
                                            },
                                        },
                                        __("Copy Shortcode", "bandsintown"),
                                    ),
                                ),
                                el(
                                    "code",
                                    {
                                        ref: shortcodeRef,
                                        style: {
                                            display: "block",
                                            padding: "12px",
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #dee2e6",
                                            borderRadius: "4px",
                                            fontSize: "12px",
                                            fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                                            wordBreak: "break-all",
                                            color: "#495057",
                                            lineHeight: "1.5",
                                            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                                        },
                                    },
                                    generateShortcode(),
                                ),

                                // Usage instruction for new users
                                !artist &&
                                    isSelected &&
                                    el(
                                        "div",
                                        {
                                            style: {
                                                marginTop: "10px",
                                                padding: "8px",
                                                backgroundColor: "#fff3cd",
                                                border: "1px solid #ffeaa7",
                                                borderRadius: "4px",
                                                fontSize: "12px",
                                                color: "#856404",
                                            },
                                        },
                                        el("strong", {}, "💡 Tip: "),
                                        "Set an artist name in the settings panel to generate a complete shortcode you can use anywhere on your site!",
                                    ),
                            ),

                        // Close Live Widget Preview
                    ),
                ),
            );
        },

        save: function () {
            // Return null since we're using PHP render callback
            return null;
        },
    });
})();
