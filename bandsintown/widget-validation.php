<?php
/**
 * Bandsintown Widget Validation Script
 * Check if the widget is properly registered for WordPress 6.8.3+
 */

// WordPress environment check
if (!defined('ABSPATH')) {
    echo "⚠️  This script must be run within WordPress environment\n";
    exit;
}

echo "🔍 Bandsintown Widget Validation for WordPress " . get_bloginfo('version') . "\n";
echo "================================================\n\n";

// Check if plugin is active
if (!is_plugin_active('bandsintown/bandsintown.php')) {
    echo "❌ Plugin is not active\n";
    echo "   → Activate the plugin first\n\n";
} else {
    echo "✅ Plugin is active\n\n";
}

// Check block registration
$block_registry = WP_Block_Type_Registry::get_instance();
if ($block_registry->is_registered('bandsintown/events-block')) {
    echo "✅ Block 'bandsintown/events-block' is registered\n";
    
    $block = $block_registry->get_registered('bandsintown/events-block');
    echo "   → Category: " . ($block->category ?? 'undefined') . "\n";
    echo "   → Has render callback: " . (isset($block->render_callback) ? 'Yes' : 'No') . "\n";
    echo "   → Supports inserter: " . (isset($block->supports['inserter']) ? 'Yes' : 'No') . "\n";
} else {
    echo "❌ Block 'bandsintown/events-block' is NOT registered\n";
    echo "   → Check block registration in bandsintown.php\n";
}
echo "\n";

// Check WordPress version compatibility
$wp_version = get_bloginfo('version');
if (version_compare($wp_version, '6.8', '>=')) {
    echo "✅ WordPress {$wp_version} supports block-based widgets\n";
    echo "   → Legacy widget registration disabled (correct behavior)\n";
} else {
    echo "⚠️  WordPress {$wp_version} uses legacy widget system\n";
    echo "   → Legacy widget should be registered\n";
}
echo "\n";

// Check widget areas
$widget_areas = wp_get_sidebars_widgets();
if (!empty($widget_areas)) {
    echo "📍 Available widget areas:\n";
    foreach ($widget_areas as $area_id => $widgets) {
        if ($area_id !== 'wp_inactive_widgets') {
            echo "   → {$area_id}\n";
        }
    }
} else {
    echo "⚠️  No widget areas found\n";
}
echo "\n";

// Check if block patterns are registered
$patterns = WP_Block_Patterns_Registry::get_instance()->get_all_registered();
$bandsintown_pattern = null;
foreach ($patterns as $pattern) {
    if (isset($pattern['name']) && $pattern['name'] === 'bandsintown/events-widget') {
        $bandsintown_pattern = $pattern;
        break;
    }
}

if ($bandsintown_pattern) {
    echo "✅ Block pattern 'bandsintown/events-widget' is registered\n";
    echo "   → Title: " . ($bandsintown_pattern['title'] ?? 'undefined') . "\n";
} else {
    echo "❌ Block pattern is NOT registered\n";
    echo "   → Pattern helps with discoverability\n";
}
echo "\n";

// Check required functions
$required_functions = [
    'drx_render_bandsintown_block',
    'get_widget_json_wp_attributes',
    'get_widget_json_all_attributes'
];

echo "🔧 Required functions check:\n";
foreach ($required_functions as $function) {
    if (function_exists($function)) {
        echo "   ✅ {$function}()\n";
    } else {
        echo "   ❌ {$function}() - Missing\n";
    }
}
echo "\n";

// Final recommendations
echo "📝 Recommendations:\n";
if (version_compare($wp_version, '6.8', '>=')) {
    echo "   1. Navigate to Appearance → Widgets\n";
    echo "   2. Click the '+' button in your desired widget area\n";
    echo "   3. Search for 'Bandsintown Events'\n";
    echo "   4. Click to add the block\n";
    echo "   5. Configure settings in the right sidebar\n";
} else {
    echo "   1. Upgrade to WordPress 6.8+ for best experience\n";
    echo "   2. Or use legacy widget drag & drop interface\n";
}

echo "\n🎯 Widget implementation should work correctly with these fixes!\n";
?>