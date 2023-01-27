/**
 * Create string of random character of specified length
 * @param length length of required string
 * @param opts By default, all chars are allowed. It's possible to disable certain chars using these options.
 * Options are `specials` `lowerCase` `upperCase` `numbers`
 */
export default function randomString(length: number, opts?: {
    noSpecials?: boolean;
    noLowerCase?: boolean;
    noUpperCase?: boolean;
    noNumbers?: boolean;
}): string;
