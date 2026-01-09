import React from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import Placeholder from '@tiptap/extension-placeholder';
import { Box, ToggleButton, ToggleButtonGroup, Paper, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <Paper elevation={0} sx={{ 
      p: 0.5, 
      mb: 1, 
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 0.5,
      bgcolor: 'background.default'
    }}>
      <ToggleButtonGroup size="small" exclusive>
        <ToggleButton
          value="bold"
          selected={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          sx={{ border: 'none' }}
        >
          <FormatBoldIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton
          value="italic"
          selected={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          sx={{ border: 'none' }}
        >
          <FormatItalicIcon fontSize="small" />
        </ToggleButton>
         <ToggleButton
          value="strike"
          selected={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          sx={{ border: 'none' }}
        >
          <StrikethroughSIcon fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>
      
      <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

      <ToggleButtonGroup size="small" exclusive>
        <ToggleButton
          value="bulletList"
          selected={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          sx={{ border: 'none' }}
        >
          <FormatListBulletedIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton
          value="orderedList"
          selected={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          sx={{ border: 'none' }}
        >
          <FormatListNumberedIcon fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Paper>
  );
};

const RichTextEditor = ({ content, onChange, placeholder }) => {
  const theme = useTheme();
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Write something...',
      }),
      BubbleMenuExtension,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
        attributes: {
            style: `min-height: 150px; outline: none;`, 
        },
    },
  });

  // Update content if changed from outside (e.g. initial load or reset)
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
        // Only emit update if content explicitly different to avoid loop?
        // editor.commands.setContent(content);
        // Be careful with cursor position loss.
        // Usually, we only set content on mount. Or if it changes drastically.
        // For now, assume controlled component pattern is loosely followed.
        if (editor.isEmpty && content) {
            editor.commands.setContent(content);
        }
    }
  }, [content, editor]);

  return (
    <Box sx={{ 
      '& .ProseMirror': {
        outline: 'none',
        minHeight: '150px',
        fontSize: '1rem',
        lineHeight: 1.6,
        color: 'text.primary',
      },
      '& .ProseMirror p.is-editor-empty:first-child::before': {
        color: 'text.secondary',
        content: 'attr(data-placeholder)',
        float: 'left',
        height: 0,
        pointerEvents: 'none',
      },
      '& ul, & ol': {
        padding: '0 1.2rem',
      },
      '& blockquote': {
        borderLeft: `3px solid ${theme.palette.divider}`,
        paddingLeft: '1rem',
        margin: '1rem 0'
      }
    }}>
      <MenuBar editor={editor} />
      
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <Paper elevation={3} sx={{ borderRadius: 1, overflow: 'hidden', display: 'flex' }}>
             <ToggleButtonGroup size="small" exclusive sx={{ bgcolor: 'background.paper' }}>
                <ToggleButton
                value="bold"
                selected={editor.isActive('bold')}
                onClick={() => editor.chain().focus().toggleBold().run()}
                sx={{ border: 'none', borderRadius: 0 }}
                >
                <FormatBoldIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton
                value="italic"
                selected={editor.isActive('italic')}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                sx={{ border: 'none', borderRadius: 0 }}
                >
                <FormatItalicIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton
                value="strike"
                selected={editor.isActive('strike')}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                sx={{ border: 'none', borderRadius: 0 }}
                >
                <StrikethroughSIcon fontSize="small" />
                </ToggleButton>
            </ToggleButtonGroup>
          </Paper>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </Box>
  );
};

export default RichTextEditor;
