# Voice Your Stance

A website that makes it amazingly easy to contact your local and federal
representatives.

## Routes

This is the exhaustive list of routes for Voice Your Stance

### `/` Homepage

The homepage gets the address of the user and will redirect the user to the
/reps page to see a list of their representatives.

### `/contact-us` Contact Us

A simple page with a mailto link to send me an email.

### `/password-reset` Password Reset

The password reset page requires a query param of `resetToken` to work. The page
is self descriptive.

### `/privacy-policy` Privacy Policy

Self descriptive. Includes the address to contact us.

### `/reps` List of Representatives

Lists out all of the users' representatives.

### `/reps/:representativeIndex` Representative Details

This page shows the contact details for a representative.

### `/reps/:representativeIndex/write/:addressIndex` Write a letter to a representative at an address

This will let the user write a letter to a specific representative at one of
their available addresses.

### `/write` Write a letter

This page will let a user start writting a letter with no representative
selected or template selected.

### `/write/draft` List of all draft letters

This page will list out all of the letters a user has started but has not
mailed, or not paid for.

### `/write/draft/:letterId` Edit a draft

This page will let a user continue editing or send a draft. Once a draft
is mailed it is no longer a draft.

### `/sent` Sent Letters

This page will list out all of the letters a user has sent and who the
user sent them to.

### `/write/:templateId` Write letter from template

This page will load a template from the registry and let a user modify it.
The user must still select a representative to mail it to before the letter can
be mailed.

### `/write/:templateId/:toId` Write a letter from a template to a representative

This page will be the new path for all shared letters and any letter that
is using a template.

### `/registered-letters` List of registered letters a user has written

This page will list out all of the registered letters a user has written.
The list will be in reverse chronological order with the most recently edited
on top.

### `/registered-letters/new` Write a new letter for the registry

This page will let a user write a new letter specifically for the registry. This
will be helpful for advocacy organizations that do not necessarily wish to send
a letter themselves but want to make their letter available to others.

### `/registered-letters/:templateId` Edit a registered letter

This page will let a user edit the settings and content of their registered
letter. Shared letters from a user will also be here with searchable set to false.
Some settings include:

- `searchable` Is the letter findable when other users are looking for a template to use
- `title`
- `tags` Allowing the user to add or remove tags

### `/registry` Top 10 letters and complete list

This page will show the 10 letters as of last build. It will also list out every
public template in the registry with a link to see just that template.

### `/registry/:templateId` Static View of a template letter

This page will preview the public letter and will provide a link so that the user
can use the letter if they wish.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

TODO: Launches the test runner in the interactive watch mode.

### `yarn build`

Builds the app for production to the `build` folder.<br />

See the section about [deployment](https://www.gatsbyjs.org/docs/overview-of-the-gatsby-build-process/) for more information.
