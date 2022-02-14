## Directory Structure

The top level directory structure will be as follows:

- assets - global static assets such as images, svgs, company logo, etc.
- components - global shared/reusable components, such as layout (wrappers, navigation), form components, buttons
- modules - JavaScript modules (all components under specific page should go here, e.g. **modules/dashboard/component.tsx** will contain components rendered in **pages/dashboard.tsx**)
- store - Global Redux store
- utils - Utilities & helper functions and the like
- pages - NextJS page files
- graphql - Apollo/GraphQL files can be found

## Naming convensions

- `.ts` - utility functions or config files will be follow `camelCase.ts`
- `.tsx` - files that holds react components
  - `page` - if it's a page file, it should follow `kebab-case.tsx`
  - `component` - if it's a component/module, should follow `PascalCase.tsx`

## Path aliasing

Added path aliasing **(@folder-name)** is used to easily determine which files were imported locally and from library, this is very helpful for better organization of imports. Library imports should come first then local.

## Graphql codegen

Running **graphql-codegen** requires you to add **.env** file with `NEXT_PUBLIC_API_URL`'s value as your graphql endpoint. After doing so, you can do `npm run codegen` which will auto generate the typescript definitions for you.

## Setting up husky, lint-staged and commitizen

- **husky** is already included under dev dependencies just `npm install` and `.husky` directory will be generated for you.
- **lint-staged** has to be manually setup in order to avoid unexpected behavior when running the script (see `.husky/pre-commit`)

We use **commitizen** to organize commits and standardize it's structure, this approach is intended as we have a goal to automate changelogs in the future. Instead of using the typical `git commit` you will have to use `npm run cz`.

## We use this tools

- [ESLint](https://eslint.org/docs/user-guide/configuring/)
- [Husky](https://typicode.github.io/husky/#/)
- [Prettier](https://prettier.io/)
- [Lint Staged](https://github.com/okonet/lint-staged)
- [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)
- [graphql-codegen](https://www.graphql-code-generator.com/)
- [commitizen](https://github.com/commitizen/cz-cli)

### [Structure reference](https://www.taniarascia.com/react-architecture-directory-structure)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
