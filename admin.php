<?php
session_start();


$ADMIN_PASSWORD = 'shoehub2024';
$PRODUCTS_FILE = 'products.json';
$UPLOAD_DIR = 'uploads/';


if (!is_dir($UPLOAD_DIR)) {
    mkdir($UPLOAD_DIR, 0755, true);
}


if (!isset($_SESSION['admin_authenticated'])) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login_password'])) {
        if ($_POST['login_password'] === $ADMIN_PASSWORD) {
            $_SESSION['admin_authenticated'] = true;
        } else {
            $login_error = 'Incorrect password';
        }
    }
    if (!isset($_SESSION['admin_authenticated'])) {
        ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login — The Shoe Hub</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --accent: #c8a97e;
            --text-main: #1a1a1a;
            --text-sub: #6b6b6b;
            --bg: #f0ede8;
            --card-bg: rgba(255,255,255,0.88);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'DM Sans', sans-serif;
            background: radial-gradient(ellipse 80% 60% at 20% 10%, #e8e2d9, transparent 60%),
                        radial-gradient(ellipse 60% 70% at 80% 90%, #d4cfc8, transparent 55%),
                        var(--bg);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-container {
            background: var(--card-bg);
            backdrop-filter: blur(28px);
            border: 1px solid rgba(255,255,255,0.9);
            border-radius: 24px;
            padding: 56px 48px;
            width: 400px;
            box-shadow: 0 32px 80px rgba(0,0,0,0.1);
            text-align: center;
        }
        .login-logo {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2rem;
            font-weight: 600;
            color: var(--text-main);
            margin-bottom: 4px;
        }
        .login-tag {
            font-size: 0.58rem;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: var(--accent);
            margin-bottom: 36px;
            display: block;
        }
        .login-label {
            font-size: 0.65rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--text-sub);
            display: block;
            text-align: left;
            margin-bottom: 8px;
        }
        .login-input {
            width: 100%;
            padding: 13px 16px;
            border: 1.5px solid #e0dbd3;
            border-radius: 10px;
            font-family: 'DM Sans', sans-serif;
            font-size: 0.9rem;
            color: var(--text-main);
            margin-bottom: 20px;
        }
        .login-input:focus {
            outline: none;
            border-color: var(--accent);
            background: white;
        }
        .login-btn {
            width: 100%;
            padding: 14px;
            background: var(--accent);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 0.8rem;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 8px 24px rgba(200,169,126,0.4);
        }
        .login-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 14px 32px rgba(200,169,126,0.5);
        }
        .login-error {
            color: #d64f4f;
            font-size: 0.78rem;
            margin-top: 12px;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-logo">The Shoe Hub</div>
        <span class="login-tag">Admin Control Panel</span>
        <form method="POST">
            <label class="login-label">Admin Password</label>
            <input type="password" name="login_password" class="login-input" placeholder="Enter password…" autofocus required>
            <button type="submit" class="login-btn">Access Dashboard</button>
            <?php if (isset($login_error)) echo '<div class="login-error">✕ ' . htmlspecialchars($login_error) . '</div>'; ?>
        </form>
        <div style="margin-top: 20px; font-size: 0.72rem; color: var(--text-sub);">Default: <strong>shoehub2026</strong></div>
    </div>
</body>
</html>
        <?php
        exit;
    }
}


$products = [];
if (file_exists($PRODUCTS_FILE)) {
    $products = json_decode(file_get_contents($PRODUCTS_FILE), true) ?: [];
}


function handleImageUpload($file) {
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'error' => 'Upload failed'];
    }
    
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mime, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'])) {
        return ['success' => false, 'error' => 'Invalid image format'];
    }
    
    if ($file['size'] > 5 * 1024 * 1024) {
        return ['success' => false, 'error' => 'Image too large (max 5MB)'];
    }
    
    $filename = 'img_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . pathinfo($file['name'], PATHINFO_EXTENSION);
    $filepath = $UPLOAD_DIR . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        return ['success' => true, 'path' => $filepath];
    }
    
    return ['success' => false, 'error' => 'Failed to save image'];
}


$message = '';
$message_type = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'add_product') {
        $name = trim($_POST['product_name'] ?? '');
        $price = intval($_POST['product_price'] ?? 0);
        $category = trim($_POST['product_category'] ?? '');
        $tag = trim($_POST['product_tag'] ?? '');
        $desc = trim($_POST['product_desc'] ?? '');
        $is_new = isset($_POST['product_new']) ? true : false;
        $img = $_POST['product_img'] ?? '';
        

        if (isset($_FILES['product_image']) && $_FILES['product_image']['size'] > 0) {
            $upload = handleImageUpload($_FILES['product_image']);
            if ($upload['success']) {
                $img = $upload['path'];
            } else {
                $message = $upload['error'];
                $message_type = 'error';
            }
        }
        
        if (!$message && $name && $price > 0) {
            $maxId = count($products) > 0 ? max(array_column($products, 'id')) : 0;
            $newProduct = [
                'id' => $maxId + 1,
                'name' => $name,
                'price' => $price,
                'category' => $category,
                'tag' => $tag,
                'desc' => $desc,
                'new' => $is_new,
                'img' => $img
            ];
            $products[] = $newProduct;
            file_put_contents($PRODUCTS_FILE, json_encode($products, JSON_PRETTY_PRINT));
            $message = "✓ Product '{$name}' added successfully!";
            $message_type = 'success';
        } elseif (!$message) {
            $message = 'Please fill in all required fields';
            $message_type = 'error';
        }
    }
    
    elseif ($action === 'edit_product') {
        $product_id = intval($_POST['product_id'] ?? 0);
        $key = array_search($product_id, array_column($products, 'id'));
        
        if ($key !== false) {
            $products[$key]['name'] = trim($_POST['product_name'] ?? '');
            $products[$key]['price'] = intval($_POST['product_price'] ?? 0);
            $products[$key]['category'] = trim($_POST['product_category'] ?? '');
            $products[$key]['tag'] = trim($_POST['product_tag'] ?? '');
            $products[$key]['desc'] = trim($_POST['product_desc'] ?? '');
            $products[$key]['new'] = isset($_POST['product_new']) ? true : false;
            

            if (isset($_FILES['product_image']) && $_FILES['product_image']['size'] > 0) {
                $upload = handleImageUpload($_FILES['product_image']);
                if ($upload['success']) {
 
                    if (!empty($products[$key]['img']) && file_exists($products[$key]['img'])) {
                        @unlink($products[$key]['img']);
                    }
                    $products[$key]['img'] = $upload['path'];
                }
            } elseif (!empty($_POST['product_img'])) {
                $products[$key]['img'] = $_POST['product_img'];
            }
            
            file_put_contents($PRODUCTS_FILE, json_encode($products, JSON_PRETTY_PRINT));
            $message = "✓ Product updated successfully!";
            $message_type = 'success';
        } else {
            $message = 'Product not found';
            $message_type = 'error';
        }
    }
    
    elseif ($action === 'delete_product') {
        $product_id = intval($_POST['product_id'] ?? 0);
        $key = array_search($product_id, array_column($products, 'id'));
        
        if ($key !== false) {
            $product_name = $products[$key]['name'];

            if (!empty($products[$key]['img']) && file_exists($products[$key]['img'])) {
                @unlink($products[$key]['img']);
            }
            array_splice($products, $key, 1);
            file_put_contents($PRODUCTS_FILE, json_encode($products, JSON_PRETTY_PRINT));
            $message = "✓ Product '{$product_name}' deleted successfully!";
            $message_type = 'success';
        } else {
            $message = 'Product not found';
            $message_type = 'error';
        }
    }
}


$edit_product = null;
if (isset($_GET['edit']) && is_numeric($_GET['edit'])) {
    $edit_id = intval($_GET['edit']);
    $key = array_search($edit_id, array_column($products, 'id'));
    if ($key !== false) {
        $edit_product = $products[$key];
    }
}

?>
<!DOCTYPE html>
<html lang="en" data-theme="white">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $edit_product ? 'Edit Product' : 'Admin Panel'; ?> — The Shoe Hub</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --accent: #c8a97e;
            --accent2: #e8d5b7;
            --text-main: #1a1a1a;
            --text-sub: #6b6b6b;
            --bg: #f0ede8;
            --card-bg: rgba(255,255,255,0.88);
            --border: rgba(0,0,0,0.09);
            --sidebar-bg: #18150f;
            --sidebar-text: #f0ede8;
            --sidebar-sub: #8a8070;
            --danger: #d64f4f;
            --success: #4a9e72;
            --r: 16px;
            --rs: 10px;
        }

        [data-theme="dark"] {
            --text-main: #f0ede8;
            --text-sub: #a0998f;
            --bg: #0e0d0b;
            --card-bg: rgba(30,28,24,0.72);
            --border: rgba(255,255,255,0.09);
            --sidebar-bg: #1a1815;
        }

        [data-theme="gaze"] {
            --text-main: #1a2e35;
            --text-sub: #4a7080;
            --bg: #ddeef2;
            --card-bg: rgba(200,230,238,0.55);
            --border: rgba(80,160,180,0.2);
            --accent: #3d8fa0;
            --accent2: #7ec0cf;
            --sidebar-bg: #2a5570;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text-main); min-height: 100vh; transition: background 0.5s, color 0.5s; }

        .layout { display: flex; height: 100vh; }


        .sidebar {
            width: 230px;
            background: var(--sidebar-bg);
            display: flex;
            flex-direction: column;
            padding: 28px 24px;
            border-right: 1px solid rgba(255,255,255,0.07);
            overflow-y: auto;
        }

        .sb-brand {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.35rem;
            font-weight: 600;
            color: var(--sidebar-text);
            margin-bottom: 8px;
        }

        .sb-brand span {
            font-family: 'DM Sans', sans-serif;
            font-size: 0.55rem;
            letter-spacing: 0.26em;
            text-transform: uppercase;
            color: var(--accent);
            display: block;
        }

        .nav-section {
            margin-top: 32px;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.07);
        }

        .nav-section-title {
            font-size: 0.58rem;
            letter-spacing: 0.26em;
            text-transform: uppercase;
            color: var(--sidebar-sub);
            margin-bottom: 12px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 11px 14px;
            color: var(--sidebar-sub);
            font-size: 0.8rem;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.2s;
            margin-bottom: 6px;
            border-left: 2px solid transparent;
        }

        .nav-item:hover {
            color: var(--sidebar-text);
            background: rgba(255,255,255,0.04);
        }

        .nav-item.active {
            color: var(--accent);
            border-left-color: var(--accent);
            background: rgba(200,169,126,0.07);
        }

        .sb-bottom {
            margin-top: auto;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.07);
        }

        .logout-btn {
            width: 100%;
            padding: 10px;
            background: transparent;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            color: var(--sidebar-sub);
            font-size: 0.72rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.2s;
        }

        .logout-btn:hover {
            border-color: rgba(255,255,255,0.25);
            color: var(--sidebar-text);
        }

        /* Main */
        .main {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }

        .header {
            background: var(--card-bg);
            border-bottom: 1px solid var(--border);
            padding: 20px 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .header-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.8rem;
            font-weight: 400;
            color: var(--text-main);
        }

        .header-title em {
            color: var(--accent);
            font-style: italic;
        }

        .header-controls {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .theme-switcher {
            display: flex;
            gap: 6px;
        }

        .theme-btn {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid var(--border);
            cursor: pointer;
            transition: transform 0.2s, border-color 0.2s;
        }

        .theme-btn.active {
            border-color: var(--accent);
            transform: scale(1.15);
        }

        .theme-btn[data-t="white"] { background: linear-gradient(135deg, #f5f0ea, #d4cfc8); }
        .theme-btn[data-t="dark"] { background: linear-gradient(135deg, #2a2820, #0e0d0b); }
        .theme-btn[data-t="gaze"] { background: linear-gradient(135deg, #b2d4dc, #3d8fa0); }

        /* Content */
        .content {
            flex: 1;
            padding: 40px;
            overflow-y: auto;
        }

        .message {
            padding: 14px 18px;
            border-radius: 10px;
            margin-bottom: 24px;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .message.success {
            background: rgba(74, 158, 114, 0.1);
            color: var(--success);
            border: 1px solid rgba(74, 158, 114, 0.2);
        }

        .message.error {
            background: rgba(214, 79, 79, 0.1);
            color: var(--danger);
            border: 1px solid rgba(214, 79, 79, 0.2);
        }

        .page-header {
            margin-bottom: 32px;
        }

        .page-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2.2rem;
            font-weight: 300;
            color: var(--text-main);
            margin-bottom: 6px;
        }

        .page-title em {
            color: var(--accent);
            font-style: italic;
        }

        .page-sub {
            font-size: 0.8rem;
            color: var(--text-sub);
        }

        /* Form */
        .form-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: var(--r);
            padding: 36px;
            max-width: 700px;
        }

        .form-section {
            margin-bottom: 28px;
        }

        .form-section-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.1rem;
            font-weight: 500;
            color: var(--text-main);
            margin-bottom: 18px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--border);
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-bottom: 14px;
        }

        .form-row.full {
            grid-template-columns: 1fr;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-label {
            font-size: 0.63rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--text-sub);
            margin-bottom: 6px;
            font-weight: 500;
        }

        input[type="text"],
        input[type="number"],
        input[type="email"],
        input[type="file"],
        select,
        textarea {
            padding: 10px 13px;
            border: 1.5px solid #e8e2d9;
            border-radius: 9px;
            font-family: 'DM Sans', sans-serif;
            font-size: 0.85rem;
            color: var(--text-main);
            background: rgba(255,255,255,0.7);
            transition: border-color 0.2s, background 0.2s;
        }

        input:focus,
        select:focus,
        textarea:focus {
            outline: none;
            border-color: var(--accent);
            background: white;
        }

        textarea {
            resize: vertical;
            min-height: 80px;
            line-height: 1.6;
        }

        select {
            appearance: none;
            cursor: pointer;
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 8px;
        }

        .checkbox-group input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        .checkbox-group label {
            font-size: 0.82rem;
            cursor: pointer;
        }

        /* Image Upload */
        .img-upload-zone {
            border: 2px dashed #d4cfc8;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 12px;
        }

        .img-upload-zone:hover {
            border-color: var(--accent);
        }

        .img-upload-zone input[type="file"] {
            display: none;
        }

        .img-upload-icon {
            font-size: 2rem;
            margin-bottom: 8px;
        }

        .img-upload-text {
            font-size: 0.8rem;
            color: var(--text-sub);
        }

        .img-preview {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 12px;
        }


        .btn-group {
            display: flex;
            gap: 12px;
            margin-top: 28px;
        }

        .btn {
            padding: 12px 28px;
            border-radius: 50px;
            border: none;
            font-family: 'DM Sans', sans-serif;
            font-size: 0.75rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s;
            flex: 1;
        }

        .btn-primary {
            background: var(--accent);
            color: white;
            box-shadow: 0 6px 20px rgba(200,169,126,0.35);
        }

        .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 28px rgba(200,169,126,0.5);
        }

        .btn-secondary {
            background: transparent;
            color: var(--text-main);
            border: 1px solid var(--border);
        }

        .btn-secondary:hover {
            border-color: var(--accent);
            color: var(--accent);
        }

        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
        }

        .product-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: var(--r);
            overflow: hidden;
            transition: all 0.3s;
        }

        .product-card:hover {
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            transform: translateY(-4px);
        }

        .product-img {
            width: 100%;
            height: 180px;
            object-fit: cover;
            background: #f5f0ea;
        }

        .product-body {
            padding: 16px;
        }

        .product-name {
            font-weight: 500;
            color: var(--text-main);
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .product-cat {
            font-size: 0.7rem;
            color: var(--accent);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 8px;
        }

        .product-price {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--text-main);
            margin-bottom: 12px;
        }

        .product-actions {
            display: flex;
            gap: 8px;
        }

        .product-actions a,
        .product-actions button {
            flex: 1;
            padding: 8px;
            border: none;
            border-radius: 8px;
            font-size: 0.7rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            display: inline-block;
            text-align: center;
        }

        .btn-edit {
            background: var(--accent2);
            color: var(--accent);
        }

        .btn-edit:hover {
            background: var(--accent);
            color: white;
        }

        .btn-delete {
            background: rgba(214, 79, 79, 0.1);
            color: var(--danger);
        }

        .btn-delete:hover {
            background: var(--danger);
            color: white;
        }

        .toolbar {
            display: flex;
            gap: 12px;
            margin-bottom: 28px;
            flex-wrap: wrap;
        }

        .search-box {
            flex: 1;
            min-width: 250px;
            position: relative;
        }

        .search-box input {
            width: 100%;
        }

        .search-icon {
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-sub);
            pointer-events: none;
        }

        .add-btn {
            padding: 10px 24px;
            background: var(--accent);
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 0.75rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .add-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(200,169,126,0.35);
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: var(--text-sub);
        }

        .empty-icon {
            font-size: 3rem;
            opacity: 0.3;
            margin-bottom: 16px;
        }

        ::-webkit-scrollbar {
            width: 5px;
        }

        ::-webkit-scrollbar-track {
            background: transparent;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--accent);
            border-radius: 10px;
        }

        @media (max-width: 768px) {
            .layout { flex-direction: column; }
            .sidebar { width: 100%; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.07); padding: 16px; }
            .form-row { grid-template-columns: 1fr; }
            .products-grid { grid-template-columns: 1fr; }
            .content { padding: 20px; }
        }
    </style>
</head>
<body data-theme="white">

<div class="layout">

    <aside class="sidebar">
        <div>
            <div class="sb-brand">The Shoe Hub <span>Admin</span></div>
            <div class="nav-section">
                <div class="nav-section-title">Dashboard</div>
                <a href="admin.php" class="nav-item <?php echo !isset($_GET['edit']) ? 'active' : ''; ?>">
                    All Products
                </a>
                <a href="admin.php?add=1" class="nav-item <?php echo isset($_GET['add']) ? 'active' : ''; ?>">
                    Add Product
                </a>
            </div>
        </div>

        <div class="sb-bottom">
            <div class="theme-switcher" style="margin-bottom: 16px;">
                <button class="theme-btn active" data-t="white" onclick="setTheme('white')" title="Light"></button>
                <button class="theme-btn" data-t="dark" onclick="setTheme('dark')" title="Dark"></button>
                <button class="theme-btn" data-t="gaze" onclick="setTheme('gaze')" title="Gaze"></button>
            </div>
            <form method="POST" style="margin: 0;">
                <button type="submit" name="logout" value="1" class="logout-btn">Logout</button>
            </form>
        </div>
    </aside>

    
    <main class="main">

        <div class="header">
            <div>
                <div class="header-title">
                    <?php if ($edit_product): ?>
                        Edit <em><?php echo htmlspecialchars($edit_product['name']); ?></em>
                    <?php elseif (isset($_GET['add'])): ?>
                        Add <em>New Product</em>
                    <?php else: ?>
                        Manage <em>Products</em>
                    <?php endif; ?>
                </div>
            </div>
        </div>


        <div class="content">
            <?php if ($message): ?>
                <div class="message <?php echo $message_type; ?>">
                    <?php echo htmlspecialchars($message); ?>
                </div>
            <?php endif; ?>

            <?php if ($edit_product || isset($_GET['add'])): ?>
    
                <div class="form-card">
                    <form method="POST" enctype="multipart/form-data">
                        <input type="hidden" name="action" value="<?php echo $edit_product ? 'edit_product' : 'add_product'; ?>">
                        <?php if ($edit_product): ?>
                            <input type="hidden" name="product_id" value="<?php echo $edit_product['id']; ?>">
                        <?php endif; ?>

                        <div class="form-section">
                            <div class="form-section-title">Product Image</div>
                            <div class="img-upload-zone" onclick="document.querySelector('input[name=product_image]').click()">
                                <div class="img-upload-icon">🖼️</div>
                                <div class="img-upload-text">Click to upload image</div>
                                <input type="file" name="product_image" accept="image/*" id="imageInput" onchange="previewImage(this)">
                            </div>
                            <?php if ($edit_product && $edit_product['img']): ?>
                                <img src="<?php echo htmlspecialchars($edit_product['img']); ?>" alt="Current" class="img-preview" id="preview">
                            <?php else: ?>
                                <img src="" alt="Preview" class="img-preview" id="preview" style="display: none;">
                            <?php endif; ?>
                            <input type="hidden" name="product_img" value="<?php echo htmlspecialchars($edit_product['img'] ?? ''); ?>" id="imgHidden">
                        </div>

                        <div class="form-section">
                            <div class="form-section-title">Product Details</div>
                            
                            <div class="form-group" style="margin-bottom: 14px;">
                                <label class="form-label">Product Name *</label>
                                <input type="text" name="product_name" value="<?php echo htmlspecialchars($edit_product['name'] ?? ''); ?>" required>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Price (UGX) *</label>
                                    <input type="number" name="product_price" value="<?php echo $edit_product['price'] ?? ''; ?>" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Category *</label>
                                    <select name="product_category" required>
                                        <option value="">Select Category</option>
                                        <option value="Classic Pumps" <?php echo (($edit_product['category'] ?? '') === 'Classic Pumps') ? 'selected' : ''; ?>>Classic Pumps</option>
                                        <option value="Sneakers" <?php echo (($edit_product['category'] ?? '') === 'Sneakers') ? 'selected' : ''; ?>>Sneakers</option>
                                        <option value="Sandals" <?php echo (($edit_product['category'] ?? '') === 'Sandals') ? 'selected' : ''; ?>>Sandals</option>
                                        <option value="Heels" <?php echo (($edit_product['category'] ?? '') === 'Heels') ? 'selected' : ''; ?>>Heels</option>
                                        <option value="Boots" <?php echo (($edit_product['category'] ?? '') === 'Boots') ? 'selected' : ''; ?>>Boots</option>
                                        <option value="Loafers" <?php echo (($edit_product['category'] ?? '') === 'Loafers') ? 'selected' : ''; ?>>Loafers</option>
                                        <option value="Flats" <?php echo (($edit_product['category'] ?? '') === 'Flats') ? 'selected' : ''; ?>>Flats</option>
                                        <option value="Other" <?php echo (($edit_product['category'] ?? '') === 'Other') ? 'selected' : ''; ?>>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group" style="margin-bottom: 14px;">
                                <label class="form-label">Tag (for filtering) *</label>
                                <input type="text" name="product_tag" value="<?php echo htmlspecialchars($edit_product['tag'] ?? ''); ?>" placeholder="e.g. pump, classic, elegant" required>
                            </div>

                            <div class="form-group" style="margin-bottom: 14px;">
                                <label class="form-label">Description</label>
                                <textarea name="product_desc"><?php echo htmlspecialchars($edit_product['desc'] ?? ''); ?></textarea>
                            </div>

                            <div class="checkbox-group">
                                <input type="checkbox" name="product_new" id="newCheckbox" <?php echo (($edit_product['new'] ?? false) ? 'checked' : ''); ?>>
                                <label for="newCheckbox">Mark as New Arrival</label>
                            </div>
                        </div>

                        <div class="btn-group">
                            <button type="submit" class="btn btn-primary">
                                <?php echo $edit_product ? 'Update Product' : 'Add Product'; ?>
                            </button>
                            <a href="admin.php" class="btn btn-secondary" style="text-decoration: none; display: flex; align-items: center; justify-content: center;">
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>

            <?php else: ?>
                <!-- Products List -->
                <div class="toolbar">
                    <div class="search-box">
                        <input type="text" id="searchInput" placeholder="Search products..." onkeyup="filterProducts()">
                        <span class="search-icon">S</span>
                    </div>
                    <a href="admin.php?add=1" class="add-btn">Add Product</a>
                </div>

                <div id="productsContainer">
                    <?php if (empty($products)): ?>
                        <div class="empty-state">
                            <div class="empty-icon"></div>
                            <p>No products yet. <a href="admin.php?add=1" style="color: var(--accent);">Add your first product →</a></p>
                        </div>
                    <?php else: ?>
                        <div class="products-grid" id="productsGrid">
                            <?php foreach ($products as $product): ?>
                                <div class="product-card" data-product="<?php echo htmlspecialchars(json_encode($product)); ?>">
                                    <img src="<?php echo htmlspecialchars($product['img'] ?? ''); ?>" alt="<?php echo htmlspecialchars($product['name']); ?>" class="product-img" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22280%22 height=%22180%22><rect fill=%22%23c8a97e22%22 width=%22280%22 height=%22180%22/></svg>'">
                                    <div class="product-body">
                                        <div class="product-cat"><?php echo htmlspecialchars($product['category']); ?></div>
                                        <div class="product-name"><?php echo htmlspecialchars($product['name']); ?></div>
                                        <div class="product-price">UGX <?php echo number_format($product['price']); ?></div>
                                        <div class="product-actions">
                                            <a href="admin.php?edit=<?php echo $product['id']; ?>" class="btn-edit">✎ Edit</a>
                                            <form method="POST" style="flex: 1;">
                                                <input type="hidden" name="action" value="delete_product">
                                                <input type="hidden" name="product_id" value="<?php echo $product['id']; ?>">
                                                <button type="submit" class="btn-delete" onclick="return confirm('Delete this product?');">🗑️ Delete</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </div>
    </main>
</div>

<script>
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('preview').src = e.target.result;
            document.getElementById('preview').style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function setTheme(t) {
    document.documentElement.dataset.theme = t;
    localStorage.setItem('adminTheme', t);
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        const productData = JSON.parse(card.dataset.product);
        const name = productData.name.toLowerCase();
        const category = productData.category.toLowerCase();
        
        if (name.includes(searchTerm) || category.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Load saved theme
const savedTheme = localStorage.getItem('adminTheme') || 'white';
setTheme(savedTheme);
document.querySelector(`[data-t="${savedTheme}"]`).classList.add('active');

// Theme switcher active state
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});
</script>

</body>
</html>
<?php

if (isset($_POST['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit;
}
?>
