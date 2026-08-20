import fs from 'node:fs';
import path from 'node:path';
import { readJSONFile } from './content';
const HSR_ELEMENTS = new Set([
  'physical',
  'fire',
  'ice',
  'lightning',
  'wind',
  'quantum',
  'imaginary',
]);
export type ContentCharacter = {
  element: string;
  rarity: string;
  character: string;
  characterPath: string;
  metadataPath: string;
};

export function getContentCharacters(
  contentPath = path.resolve('src/content'),
  includeWip = false,
): ContentCharacter[] {
  if (!fs.existsSync(contentPath)) return [];

  return fs
    .readdirSync(contentPath, { withFileTypes: true })
    .filter(
    (entry) =>
        entry.isDirectory() &&
        HSR_ELEMENTS.has(entry.name),
    )
    .flatMap((element) =>
      fs
        .readdirSync(path.join(contentPath, element.name), {
          withFileTypes: true,
        })
        .filter((entry) => entry.isDirectory())
        .flatMap((rarity) =>
          fs
            .readdirSync(path.join(contentPath, element.name, rarity.name), {
              withFileTypes: true,
            })
            .filter((entry) => entry.isDirectory())
            .flatMap((character) => {
              const characterPath = path.join(
                contentPath,
                element.name,
                rarity.name,
                character.name,
              );
              const metadataPath = path.join(characterPath, 'metadata.json');

              if (!fs.existsSync(metadataPath)) return [];

              const isWip =
                String(readJSONFile(metadataPath)?.last_updated ?? '')
                  .trim()
                  .toUpperCase() === 'WIP';

              return isWip && !includeWip
                ? []
                : [
                    {
                      element: element.name,
                      rarity: rarity.name,
                      character: character.name,
                      characterPath,
                      metadataPath,
                    },
                  ];
            }),
        ),
    );
}

export function getCharacterBuilds(characterPath: string) {
  return fs
    .readdirSync(characterPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      path: path.join(characterPath, entry.name),
    }));
}
