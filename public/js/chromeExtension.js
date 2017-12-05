function installChromeApp() {
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if (!isChrome) {
        window.location.href = "https://chrome.google.com/webstore/detail/flutur-small-flutters-cau/onebagjpomhjadhoiianmnelkbcnllnf";
        return;
    }

    chrome.webstore.install(
        "https://chrome.google.com/webstore/detail/onebagjpomhjadhoiianmnelkbcnllnf",
        function() {},
        function(err) {
            window.location.href = "https://chrome.google.com/webstore/detail/flutur-small-flutters-cau/onebagjpomhjadhoiianmnelkbcnllnf";
        });
}