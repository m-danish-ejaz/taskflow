module.exports = {

"[project]/src/app/Pages/Home/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: require } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$DynamicForm$2f$DynamicForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/app/components/ui/DynamicForm/DynamicForm.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$lazyImage$2f$lazyImage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/app/components/ui/lazyImage/lazyImage.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$greenBg$2e$jpg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$greenBg$2e$jpg__$5b$app$2d$ssr$5d$__$28$static$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object$2c$__ecmascript$29$__ = __turbopack_import__('[project]/src/assets/images/greenBg.jpg.mjs { IMAGE => "[project]/src/assets/images/greenBg.jpg [app-ssr] (static)" } [app-ssr] (structured image object, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$greenBg$2d$small$2e$jpg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$greenBg$2d$small$2e$jpg__$5b$app$2d$ssr$5d$__$28$static$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object$2c$__ecmascript$29$__ = __turbopack_import__('[project]/src/assets/images/greenBg-small.jpg.mjs { IMAGE => "[project]/src/assets/images/greenBg-small.jpg [app-ssr] (static)" } [app-ssr] (structured image object, ecmascript)');
"use client";
;
;
;
;
;
const Login = ()=>{
    const formFields = [
        {
            type: "email",
            modelName: "email",
            label: "E-mail",
            className: "border-0 mt-8 border-gray-400 flex flex-col border-b-[1px] font-montserrat rounded-none focus-visible:outline-none",
            validators: [
                {
                    type: "required",
                    message: "Email is required"
                },
                {
                    type: "pattern",
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format"
                }
            ]
        },
        {
            type: "password",
            modelName: "password",
            label: "Password",
            className: "border-0 mt-8 border-gray-400 flex flex-col border-b-[1px] font-montserrat rounded-none focus-visible:outline-none",
            validators: [
                {
                    type: "required",
                    message: "Password is required"
                },
                {
                    type: "minLength",
                    value: 8,
                    message: "Password must be at least 8 characters"
                }
            ]
        },
        {
            modelName: "date",
            label: "Date of Birth",
            type: "date",
            placeholder: "Select your date of birth",
            className: "border-0 mt-8 border-gray-400 flex flex-col border-b-[1px] font-montserrat rounded-none focus-visible:outline-none bg-transparent",
            validators: [
                {
                    type: "required",
                    message: "Date of birth is required"
                }
            ]
        },
        {
            modelName: "country",
            label: "Country",
            type: "select",
            placeholder: "Select your country",
            options: [
                {
                    label: "United States",
                    value: "US"
                },
                {
                    label: "Canada",
                    value: "CA"
                },
                {
                    label: "United Kingdom",
                    value: "UK"
                }
            ],
            className: "border-0 mt-8 border-gray-400 flex flex-col border-b-[1px] font-montserrat rounded-none focus-visible:outline-none bg-transparent",
            validators: [
                {
                    type: "required",
                    message: "Country is required"
                }
            ]
        },
        {
            type: "file",
            modelName: "upload",
            label: "Upload your Image",
            uploaderPlaceholder: "Upload",
            className: "flex flex-row mt-3 font-montserrat focus-visible:outline-none rounded-2xl",
            validators: [
                {
                    type: "required",
                    message: "Image is required"
                }
            ]
        }
    ];
    const handleFormSubmit = async (data)=>{
        console.log(data);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-screen justify-center items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$lazyImage$2f$lazyImage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$greenBg$2e$jpg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$greenBg$2e$jpg__$5b$app$2d$ssr$5d$__$28$static$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
                thumb: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$images$2f$greenBg$2d$small$2e$jpg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$images$2f$greenBg$2d$small$2e$jpg__$5b$app$2d$ssr$5d$__$28$static$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object$2c$__ecmascript$29$__["default"],
                className: "absolute w-full h-full object-cover inset-0"
            }, void 0, false, {
                fileName: "[project]/src/app/Pages/Home/page.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 p-10 flex flex-col justify-center items-center w-full h-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$DynamicForm$2f$DynamicForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    fields: formFields,
                    onSubmit: handleFormSubmit,
                    className: "mt-4 w-96 p-8 gap-[0.25rem] rounded-3xl shadow-neon-green border-0 bg-white bg-opacity-5",
                    buttonTitle: "Submit",
                    buttonClassName: "shadow-neon-green flex rounded-2xl w-32 mt-12 bg-Awesomegray h-auto col-span-full justify-center hover:bg-white hover:text-black"
                }, void 0, false, {
                    fileName: "[project]/src/app/Pages/Home/page.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/Pages/Home/page.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/Pages/Home/page.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = Login;
}}),
"[project]/src/app/Pages/Home/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules ssr)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: require } = __turbopack_context__;
{
}}),

};

//# sourceMappingURL=src_app_Pages_Home_page_tsx_778b87._.js.map