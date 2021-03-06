$(document).ready(function () {
    if (Cookies.get("SidebarState") === "Collapsed") {
        $("body").addClass("page-sidebar-closed");
        $(".page-sidebar-menu").addClass("page-sidebar-menu-closed");
    }

    $('#clickmewow').click(function () {
        $('#radio1003').attr('checked', 'checked');
    });

    $("input.only-numbers").keypress(function () {
        return isNumberKey(event);
    });

    $('.page-sidebar-menu a.nav-link.active').each(function (i, e) {
        var navItem = $(e).parent('li.nav-item');
        if (navItem && navItem.length > 0) {
            tagNavigationAsActive(navItem);
        }
    });

    $("body").on("click", "a", function () {

        var href = $(this).attr("href");

        var nomodal = $(this).attr("nomodal");
        if (nomodal !== undefined) return;

        if (href && href !== "#" && !href.startsWith("#") && href.indexOf("javascript:") == -1 && href.indexOf("#tab") == -1 && !$(this).attr("download") && $(this).attr("target") !== "_blank") {
            $("#NavigatingScreen").modal("hide");
            $("#NavigatingScreen").modal("show");
            window.location.replace(href);
        }
    });

    $(".sidebar-toggler").click(function () {
        if ($("body").hasClass("page-sidebar-closed")) {
            Cookies.set("SidebarState", "Expanded");
        }
        else {
            Cookies.set("SidebarState", "Collapsed");
        }
    });
})
