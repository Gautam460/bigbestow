'use client';

import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function CKEditorWrapper({ value, onChange }) {
    return (
        <div className="text-slate-900 prose-sm w-full max-w-none">
            <CKEditor
                editor={ClassicEditor}
                data={value}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data);
                }}
            />
            <style jsx global>{`
                .ck-editor__editable_inline {
                    min-height: 300px;
                }
            `}</style>
        </div>
    );
}
