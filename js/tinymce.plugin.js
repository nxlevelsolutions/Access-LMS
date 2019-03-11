tinymce.PluginManager.add('lmskeywords', function (editor, url) {
    // Add a button that opens a window
    editor.addButton('lmskeywords', {
        text: '{LMS Key Words}',
        icon: false,
        onclick: function () {
            // Open window
            editor.windowManager.open({
                title: 'Insert LMS Key Words',
                body: [
                    //{ type: 'textbox', name: 'title', label: 'Title' },
                    { type: 'label', text: 'Select a key word below and click Ok. The selected key word' },
                    { type: 'label', text: 'will be replaced by its corresponding value whent the email is' },
                    { type: 'label', text: 'generated and sent.' },
                    {
                        type: 'listbox',
                        name: 'keyWord',
                        label: 'Select a key word for:',
                        Xtext: "Click to select",
                        values: [{ text: "Learner first name", value: "{FirstName}" },
                                 { text: "Learner last name",  value: "{LastName}" },
                                 { text: "Due date",           value: "{DueDate}" },
                                 { text: "LMS URL",           value: "{LMSUrl}" },
                                 { text: "Courses Assigned",   value: "{CoursesAssigned}"}],
                        onselect: function (e) {
                            //alert(e.control.settings.value);
                        }
                    }
                ],
                onsubmit: function (e) {
                    // Insert content when the window form is submitted
                    editor.insertContent(e.data.keyWord);
                }
            });
        }
    });

    // Adds a menu item to the tools menu
    //editor.addMenuItem('example', {
    //    text: 'Example plugin',
    //    context: 'tools',
    //    onclick: function () {
    //        // Open window with a specific url
    //        editor.windowManager.open({
    //            title: 'TinyMCE site',
    //            url: 'https://www.tinymce.com',
    //            width: 800,
    //            height: 600,
    //            buttons: [{
    //                text: 'Close',
    //                onclick: 'close'
    //            }]
    //        });
    //    }
    //});

    return {
        getMetadata: function () {
            return {
                name: "LMS Key Words plugin",
                url: ""
            };
        }
    };
});
