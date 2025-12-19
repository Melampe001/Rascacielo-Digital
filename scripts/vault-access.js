#!/usr/bin/env node

/**
 * Vault Access CLI
 * Herramienta de línea de comandos para acceder a archivos protegidos
 */

const fileVault = require('../modules/security/file-vault');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('🔒 RASCACIELO DIGITAL - VAULT ACCESS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const username = await question('👤 Username: ');
  const email = await question('📧 Email: ');

  const user = { username, email };

  const action = await question(
    '\n📋 Acción:\n  1. Listar archivos protegidos\n  2. Acceder a archivo\n  3. Blindar nuevo archivo\n  4. Blindar todos los sensibles\n\nOpción: '
  );

  try {
    switch (action) {
      case '1': {
        const files = await fileVault.listProtected(user);
        console.log('\n📂 Archivos protegidos:');
        files.forEach((f, i) => console.log(`   ${i + 1}. ${f}`));
        break;
      }

      case '2': {
        const filePath = await question('\n📄 Ruta del archivo: ');
        const content = await fileVault.accessFile(filePath, user);
        console.log('\n✅ Contenido desencriptado:\n');
        console.log(content);
        break;
      }

      case '3': {
        const filePath = await question('\n📄 Ruta del archivo a blindar: ');
        await fileVault.protectFile(filePath, user);
        console.log('\n✅ Archivo blindado exitosamente');
        break;
      }

      case '4': {
        const confirm = await question('\n⚠️  ¿Blindar TODOS los archivos sensibles? (yes/no): ');
        if (confirm.toLowerCase() === 'yes') {
          await fileVault.protectAll(user);
          console.log('\n✅ Blindaje completado');
        } else {
          console.log('\n❌ Operación cancelada');
        }
        break;
      }

      default:
        console.log('\n❌ Opción inválida');
    }
  } catch (error) {
    console.error(`\n❌ ${error.message}`);
  }

  rl.close();
}

main();
