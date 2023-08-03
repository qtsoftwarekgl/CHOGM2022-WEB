import JoditEditor from 'jodit-react';
import React, { useRef } from 'react';

interface EditorProps {
	description: string;
	sendHtml?: (txt: any) => void
}

export const Editor = (props: React.PropsWithChildren<EditorProps>) => {
	const { description, sendHtml } = props;
	const editor = useRef(null);

	const config = {
		readonly: false,
		placeholder: 'Start typing...',
		height: 550,
		enableDragAndDropFileToEditor: true,
		tabIndex: -1,
		uploader: {
      insertImageAsBase64URI: true
		},
		removeButtons: ['source', 'fullsize', 'about', 'outdent', 'video', 'print', 'file', 'paragraph'],
	}

	const onChange = (e: any) => sendHtml?.(e);

	return (
		<>
			<div className="mb-1">
				<label className="block text-sm font-medium text-gray-700" htmlFor="body">Description</label>
			</div>
			<JoditEditor
				ref={editor}
				config={config}
				value={description}
				onBlur={onChange} // preferred to use only this option to update the Html for performance reasons
			/>
		</>
	)
}