import { Configuration } from 'webpack';
export declare function getTaggedJsConfig(pathTo: string): any;
export declare function getConfig(pathTo?: string): Configuration;
export declare function getBaseConfig({ entry, outDir, outName }: {
    entry: string;
    outDir: string;
    outName?: string;
}): Configuration;
