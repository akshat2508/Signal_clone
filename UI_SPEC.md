# UI Specification

## Visual Source

The attached Signal Desktop/macOS screenshots are the primary visual reference.

Recreate the visual language independently. Do not copy proprietary code, logos, or assets.

## Overall Layout

Desktop:

```text
┌──────────────────────────┬──────────────────────────────────────────────┐
│ Sidebar                  │ Chat                                         │
│                          │                                              │
│ Profile / actions        │ Chat header                                  │
│ Search                   │                                              │
│ Conversation list        │ Messages                                     │
│                          │                                              │
│                          │                                              │
│                          │ Composer                                     │
└──────────────────────────┴──────────────────────────────────────────────┘
```

The sidebar should feel compact and native to a desktop messenger. The chat area should occupy the remaining width.

## Sidebar

Include:
- profile/avatar area
- new conversation action
- search
- conversation list
- selected conversation state
- unread badge/count
- last message preview
- timestamp
- online indicator where useful

Sort conversations by most recent activity.

## Chat Header

Include:
- avatar
- name/group name
- online or last-seen state
- search action
- call placeholder
- video placeholder
- more actions

## Messages

Support:
- incoming messages
- outgoing messages
- timestamps
- grouped consecutive messages
- status indicators
- unread divider
- date divider
- typing indicator
- scroll-to-bottom behavior

Keep message bubbles visually restrained and native-looking.

## Composer

Include:
- attachment action
- text input
- send action
- optional emoji action

Behavior:
- Enter sends
- Shift+Enter creates newline
- Empty message cannot be sent
- Sending state can render optimistically
- Failed sends must be recoverable

## New Message

Flow:
1. Click New Message
2. Search users
3. Select a user
4. Create/open direct conversation
5. Focus composer

## Group Creation

Flow:
1. Enter group name
2. Search/select members
3. Create
4. Open group chat

## Settings

Sections:
- Profile
- Privacy
- Notifications
- Appearance
- Chat Settings
- Linked Devices
- About

Unsupported areas may show "Coming Soon".

## Responsive Behavior

Desktop is primary.

On smaller widths:
- sidebar and chat should behave like a mobile messenger
- avoid horizontal overflow
- preserve composer usability
- preserve readable message widths

## Interaction Quality

Include:
- loading states
- skeletons where useful
- empty states
- error states
- toasts
- confirmation dialogs
- disabled states
- hover states
- focus states
- subtle transitions

Avoid animation for animation's sake.

## Visual Review Checklist

Compare the implementation against the screenshots for:
- sidebar proportions
- header heights
- spacing
- typography
- icon scale
- avatar scale
- separators
- selected state
- message spacing
- bubble shape
- composer dimensions
- alignment
- empty states
